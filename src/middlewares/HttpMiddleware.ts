import { Action } from 'redux';
import { delay } from 'redux-saga';
import { call, put, race, take } from 'redux-saga/effects';
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
      [descriptor.actions.CREATE]: fnCreate,
      [descriptor.actions.READ]: fnRead,
      [descriptor.actions.UPDATE]: fnUpdate,
      [descriptor.actions.DELETE]: fnDelete,
      [descriptor.actions.LIST]: fnList,
    };

    return function*(action: Action, next: any) {
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
    cancel: take([descriptor.actions.CREATE_CANCEL, descriptor.actions.RESET]),
    res: api.post(`${path}`, item),
    timeout: call(delay, configTimeout),
  });

    if (res && res.ok) {
    // Success.
    const data = yield call(() => res.json());
    yield put(descriptor.creators.doCreateSuccess({
        ...action.payload.item,
      ...data,
      [fields.id]: descriptor.data.id(data),
      }));
    yield * next();
} else if (cancel) {
  // Cancelled.
  yield * next();
} else if (timeout) {
  // Timeout.
  yield put(descriptor.creators.doCreateFailure(action.payload.item, `timedout`));
  yield * next();
} else {
  // Error.
  yield put(descriptor.creators.doCreateFailure({ ...action.payload.item }, `${res.status} ${res.statusText}`));
  yield * next();
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
      cancel: take([descriptor.actions.READ_CANCEL, descriptor.actions.RESET]),
      res: api.get(`${path}/${key}`),
      timeout: call(delay, configTimeout),
    });

    if (res && res.ok) {
      // Success.
      const data = yield call(() => res.json());
      yield put(descriptor.creators.doReadSuccess({
        ...action.payload.item,
        ...data,
        [fields.id]: key,
      }));
      yield* next();
  } else if (cancel) {
    // Cancelled.
    yield * next();
  } else if (timeout) {
    // Timeout.
    yield put(descriptor.creators.doReadFailure(action.payload.item, `timedout`));
    yield * next();
  } else {
    // Error.
    yield put(descriptor.creators.doReadFailure(action.payload.item, `${res.status} ${res.statusText}`));
    yield * next();
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
      cancel: take([descriptor.actions.UPDATE_CANCEL, descriptor.actions.RESET]),
      res: api.put(`${path}/${key}`, { ...item, id: key }),
      timeout: call(delay, configTimeout),
  });

    if (res && res.ok) {
    // Success.
    const data = yield call(() => res.json());
    yield put(descriptor.creators.doUpdateSuccess({
        ...action.payload.item,
      ...data,
      [fields.id]: data.id,
      }));
    yield * next();
} else if (cancel) {
  // Cancelled.
  yield * next();
} else if (timeout) {
  // Timeout.
  yield put(descriptor.creators.doUpdateFailure(action.payload.item, `timedout`));
  yield * next();
} else {
  // Error.
  yield put(descriptor.creators.doUpdateFailure({ ...action.payload.item }, `${res.status} ${res.statusText}`));
  yield * next();
    }
  };
}

function sagaDelete<T>(api: IHttpApiHandler, path: string, descriptor: IResourceDescriptor<T>) {
  return (next: any) => function*(action: any) {
    if (descriptor.fields.neverCommited(action.payload.item)) {
      yield put(descriptor.creators.doDeleteSuccess(action.payload.item));
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
      cancel: take([descriptor.actions.DELETE_CANCEL, descriptor.actions.RESET]),
      res: api.del(`${path}/${key}`, item),
      timeout: call(delay, configTimeout),
    });

    if (res && (res.ok || res.status === http404)) {
      // Success, or non existing.
      yield put(descriptor.creators.doDeleteSuccess(action.payload.item));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else if (timeout) {
      // Timeout.
      yield put(descriptor.creators.doDeleteFailure(action.payload.item, `timedout`));
      yield* next();
    } else {
      // Error.
      yield put(descriptor.creators.doDeleteFailure(action.payload.item, `${res.status} ${res.statusText}`));
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
        cancel: take([descriptor.actions.LIST_CANCEL, descriptor.actions.RESET]),
        res: api.get(`${path}`),
        timeout: call(delay, configTimeout),
      });

      if (res && res.ok) {
        // Success.
        const data = yield call(() => res.json());
        yield put(descriptor.creators.doListSuccess(data.map((item: T) => ({
          [fields.id]: descriptor.data.id(item),
          [fields.isRead]: true,
          ...(item as any),
          })), action.params));
        yield* next();
      } else if (cancel) {
        // Cancelled.
        yield* next();
      } else if (timeout) {
        // Timeout.
        yield put(descriptor.creators.doListFailure(action.payload.item, `timedout`));
        yield* next();
      } else {
        // Error.
        yield put(descriptor.creators.doListFailure(`${res.status} ${res.statusText}`, action.payload.params));
        yield* next();
      }
    } catch (ex) {
      yield put(descriptor.creators.doListFailure(`${ex.message}`, action.payload.params));
    }
  };
}
