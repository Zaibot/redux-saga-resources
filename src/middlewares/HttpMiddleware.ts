import { IAction } from '@zaibot/fsa';
import { put, take } from '@zaibot/fsa-saga';
import { delay, Effect } from 'redux-saga';
import { call, race } from 'redux-saga/effects';
import { fields, IResourceDescriptor, stripFields } from '../resource';

const configTimeout = 8000;
const http404 = 404;

export interface IHttpApiHandler {
  get(path: string): /*CallEffect*/ any;
  post(path: string, entity: any): /*CallEffect*/ any;
  patch(path: string, entity: any): /*CallEffect*/ any;
  put(path: string, entity: any): /*CallEffect*/ any;
  del(path: string, entity: any): /*CallEffect*/ any;
}

export function HttpMiddleware<T>(api: IHttpApiHandler, path: string) {
  return (descriptor: IResourceDescriptor<T>) => {
    const fnCreate = sagaCreate(api, path, descriptor);
    const fnRead = sagaRead(api, path, descriptor);
    const fnUpdate = sagaUpdate(api, path, descriptor);
    const fnDelete = sagaDelete(api, path, descriptor);
    const fnList = sagaList(api, path, descriptor);

    const mapping = {
      [descriptor.actions.CREATE.type]: fnCreate,
      [descriptor.actions.READ.type]: fnRead,
      [descriptor.actions.UPDATE.type]: fnUpdate,
      [descriptor.actions.DELETE.type]: fnDelete,
      [descriptor.actions.LIST.type]: fnList,
    };

    return function*(action: IAction, next: any) {
      if (action.type in mapping) {
        yield* mapping[action.type](next)(action);
      }
    };
  };
}

function sagaCreate<T>(api: IHttpApiHandler, path: string, descriptor: IResourceDescriptor<T>) {
  return (next: any) => function*(action: any) {
    const item = stripFields(action.payload.item);
    delete item[descriptor.options.id];
    const {
    res,
      cancel,
      timeout,
  } = yield race({
        cancel: take([descriptor.actions.CREATE_CANCEL, descriptor.actions.RESET]) as Effect,
        res: api.post(`${path}`, item),
        timeout: call(delay, configTimeout),
      });

    if (res && res.ok) {
      // Success.
      const data = yield call(() => res.json());
      yield put(descriptor.actions.CREATE_SUCCESS({
        item: { ...action.payload.item, ...data },
        [fields.id]: descriptor.data.id(data),
      }));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else if (timeout) {
      // Timeout.
      yield put(descriptor.actions.CREATE_FAILURE({ item: action.payload.item, reason: `timedout` }));
      yield* next();
    } else {
      // Error.
      yield put(descriptor.actions.CREATE_FAILURE({ item: action.payload.item, reason: `${res.status} ${res.statusText}` }));
      yield* next();
    }
  };
}

function sagaRead<T>(api: IHttpApiHandler, path: string, descriptor: IResourceDescriptor<T>) {
  return (next: any) => function*(action: any) {
    const key = descriptor.data.id(action.payload.item);
    const {
      res,
      cancel,
      timeout,
    } = yield race({
        cancel: take([descriptor.actions.READ_CANCEL, descriptor.actions.RESET]) as Effect,
        res: api.get(`${path}/${key}`),
        timeout: call(delay, configTimeout),
      });

    if (res && res.ok) {
      // Success.
      const data = yield call(() => res.json());
      yield put(descriptor.actions.READ_SUCCESS({
        item: { ...action.payload.item, ...data },
        [fields.id]: key,
      }));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else if (timeout) {
      // Timeout.
      yield put(descriptor.actions.READ_FAILURE({ item: action.payload.item, reason: `timedout` }));
      yield* next();
    } else {
      // Error.
      yield put(descriptor.actions.READ_FAILURE({ item: action.payload.item, reason: `${res.status} ${res.statusText}` }));
      yield* next();
    }
  };
}

function sagaUpdate<T>(api: IHttpApiHandler, path: string, descriptor: IResourceDescriptor<T>) {
  return (next: any) => function*(action: any) {
    const key = descriptor.data.id(action.payload.item);
    const item = stripFields(action.payload.item);
    const {
      res,
      cancel,
      timeout,
    } = yield race({
        cancel: take([descriptor.actions.UPDATE_CANCEL, descriptor.actions.RESET]) as Effect,
        res: api.put(`${path}/${key}`, { ...item, id: key }),
        timeout: call(delay, configTimeout),
      });

    if (res && res.ok) {
      // Success.
      const data = yield call(() => res.json());
      yield put(descriptor.actions.UPDATE_SUCCESS({
        item: { ...action.payload.item, ...data },
        [fields.id]: data.id,
      }));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else if (timeout) {
      // Timeout.
      yield put(descriptor.actions.UPDATE_FAILURE({ item: action.payload.item, reason: `timedout` }));
      yield* next();
    } else {
      // Error.
      yield put(descriptor.actions.UPDATE_FAILURE({ item: action.payload.item, reason: `${res.status} ${res.statusText}` }));
      yield* next();
    }
  };
}

function sagaDelete<T>(api: IHttpApiHandler, path: string, descriptor: IResourceDescriptor<T>) {
  return (next: any) => function*(action: any) {
    if (descriptor.fields.neverCommited(action.payload.item)) {
      yield put(descriptor.actions.DELETE_SUCCESS(action.payload.item));
      yield* next();
      return;
    }

    const key = descriptor.data.id(action.payload.item);
    const item = stripFields(action.payload.item);
    const {
      res,
      timeout,
      cancel,
    } = yield race({
        cancel: take([descriptor.actions.DELETE_CANCEL, descriptor.actions.RESET]) as Effect,
        res: api.del(`${path}/${key}`, item),
        timeout: call(delay, configTimeout),
      });

    if (res && (res.ok || res.status === http404)) {
      // Success, or non existing.
      yield put(descriptor.actions.DELETE_SUCCESS(action.payload.item));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else if (timeout) {
      // Timeout.
      yield put(descriptor.actions.DELETE_FAILURE({ item: action.payload.item, reason: `timedout` }));
      yield* next();
    } else {
      // Error.
      yield put(descriptor.actions.DELETE_FAILURE({ item: action.payload.item, reason: `${res.status} ${res.statusText}` }));
      yield* next();
    }
  };
}

function sagaList<T>(api: IHttpApiHandler, path: string, descriptor: IResourceDescriptor<T>) {
  return (next: any) => function*(action: any) {
    try {
      const {
        res,
        cancel,
        timeout,
      } = yield race({
          cancel: take([descriptor.actions.LIST_CANCEL, descriptor.actions.RESET]) as Effect,
          res: api.get(`${path}`),
          timeout: call(delay, configTimeout),
        });

      if (res && res.ok) {
        // Success.
        const data = yield call(() => res.json());
        yield put(descriptor.actions.LIST_SUCCESS({
          list: data.map((item: T) => ({
            [fields.id]: descriptor.data.id(item),
            [fields.isRead]: true,
            ...(item as any),
          }) as T),
          params: action.payload.params,
        }));
        yield* next();
      } else if (cancel) {
        // Cancelled.
        yield* next();
      } else if (timeout) {
        // Timeout.
        yield put(descriptor.actions.LIST_FAILURE({ params: action.payload.params, reason: `timedout` }));
        yield* next();
      } else {
        // Error.
        yield put(descriptor.actions.LIST_FAILURE({ params: action.payload.params, reason: `${res.status} ${res.statusText}` }));
        yield* next();
      }
    } catch (ex) {
      yield put(descriptor.actions.LIST_FAILURE({ params: action.payload.params, reason: `${ex.message}` }));
    }
  };
}
