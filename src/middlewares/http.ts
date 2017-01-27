import { takeEvery } from 'redux-saga';
import { call, take, race, put, fork, join } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fields, stripFields } from '../resource/fields';
import { IResource } from '../resource';

const configTimeout = 8000;

export interface IHttpApiHandler {
  get(path: string): /*CallEffect*/ any;
  post(path: string, entity: any): /*CallEffect*/ any;
  patch(path: string, entity: any): /*CallEffect*/ any;
  put(path: string, entity: any): /*CallEffect*/ any;
  del(path: string, entity: any): /*CallEffect*/ any;
}

export function httpMiddleware(api: IHttpApiHandler, path: string) {
  return (descriptor) => {
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
      [descriptor.actions.LIST]: fnList
    };

    return function* (action, next) {
      if (action.type in mapping) {
        yield* mapping[action.type](next)(action);
      }
    };
  };
}


function sagaCreate<T>(api: IHttpApiHandler, path: string, descriptor: IResource<T>) {
  return next => function* (action) {
    const tempId = action.payload.item[fields.tempId];
    const {
      id,
      ...item
    } = stripFields(action.payload.item);
    const {
      res,
      cancel
    } = yield race({
      res: api.post(`${path}`, item),
      cancel: take([descriptor.actions.CREATE_CANCEL, descriptor.actions.RESET]),
      timeout: call(delay, configTimeout)
    });

    if (res && res.ok) {
      // Success.
      const data = yield call(() => res.json());
      yield put(descriptor.creators.doCreateSuccess({
        ...action.payload.item,
        ...data,
        [fields.id]: descriptor.data.id(data)
      }));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else {
      // Error.
      yield put(descriptor.creators.doCreateFailure({ ...action.payload.item }, `${res.status} ${res.statusText}`));
      yield* next();
    }
  };
}

function sagaRead<T>(api: IHttpApiHandler, path: string, descriptor: IResource<T>) {
  return next => function* (action) {
    const key = descriptor.data.id(action.payload.item);
    const item = stripFields(action.payload.item);
    const {
      res,
      cancel
    } = yield race({
      res: api.get(`${path}/${key}`),
      cancel: take([descriptor.actions.READ_CANCEL, descriptor.actions.RESET]),
      timeout: call(delay, configTimeout)
    });

    if (res && res.ok) {
      // Success.
      const data = yield call(() => res.json());
      yield put(descriptor.creators.doReadSuccess({
        ...action.payload.item,
        ...data,
        [fields.id]: key
      }));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else {
      // Error.
      yield put(descriptor.creators.doReadFailure(action.payload.item, `${res.status} ${res.statusText}`));
      yield* next();
    }
  };
}

function sagaUpdate<T>(api: IHttpApiHandler, path: string, descriptor: IResource<T>) {
  return next => function* (action) {
    const key = descriptor.data.id(action.payload.item);
    const item = stripFields(action.payload.item);
    const {
      res,
      cancel
    } = yield race({
      res: api.put(`${path}/${key}`, { ...item, id: key }),
      cancel: take([descriptor.actions.UPDATE_CANCEL, descriptor.actions.RESET]),
      timeout: call(delay, configTimeout)
    });

    if (res && res.ok) {
      // Success.
      const data = yield call(() => res.json());
      yield put(descriptor.creators.doUpdateSuccess({
        ...action.payload.item,
        ...data,
        [fields.id]: data.id
      }));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else {
      // Error.
      yield put(descriptor.creators.doUpdateFailure({ ...action.payload.item }, `${res.status} ${res.statusText}`));
      yield* next();
    }
  };
}

function sagaDelete<T>(api: IHttpApiHandler, path: string, descriptor: IResource<T>) {
  return next => function* (action) {
    if (descriptor.fields.neverCommited(action.payload.item)) {
      yield put(descriptor.creators.doDeleteSuccess(action.payload.item));
      yield* next();
      return;
    }

    const key = descriptor.data.id(action.payload.item);
    const item = stripFields(action.payload.item);
    const {
      res,
      cancel
    } = yield race({
      res: api.del(`${path}/${key}`, item),
      cancel: take([descriptor.actions.DELETE_CANCEL, descriptor.actions.RESET]),
      timeout: call(delay, configTimeout)
    });

    if (res && res.ok || res.status === 404) {
      // Success, or non existing.
      yield put(descriptor.creators.doDeleteSuccess(action.payload.item));
      yield* next();
    } else if (cancel) {
      // Cancelled.
      yield* next();
    } else {
      // Error.
      yield put(descriptor.creators.doDeleteFailure(action.payload.item, `${res.status} ${res.statusText}`));
      yield* next();
    }
  };
}

function sagaList<T>(api: IHttpApiHandler, path: string, descriptor: IResource<T>) {
  return next => function* (action) {
    try {
      const {
        res,
        cancel
      } = yield race({
        res: api.get(`${path}`),
        cancel: take([descriptor.actions.LIST_CANCEL, descriptor.actions.RESET]),
        timeout: call(delay, configTimeout)
      });

      if (res && res.ok) {
        // Success.
        const data = yield call(() => res.json());
        yield put(descriptor.creators.doListSuccess(data.map(item => ({
          [fields.id]: descriptor.data.id(item),
          [fields.isRead]: true,
          ...item
        })), action.params));
        yield* next();
      } else if (cancel) {
        // Cancelled.
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
