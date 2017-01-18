import {
  call,
  fork,
  takeEvery,
  select,
  put
} from 'redux-saga/effects';

function applyMiddlewares(...middlwares) {
  return middlwares.slice(0).reverse().reduce((next, middleware) => {
    return function*(action) {
      yield* middleware(action, function*(a = action) {
        yield* next(a);
      });
    };
  }, function*(action) {
    console.error(`Reached end of middleware.`, action)
  });
}

function defaultMiddleware(descriptor, options) {
  const {
    resource
  } = descriptor;
  return function*(action) {
    if (action.type === descriptor.actions.SELECT) {
      const item = yield select(descriptor.resource.selectors.itemByItem(action.payload.item));
      yield put(descriptor.creators.doEdit(item));
    } else if (action.type === descriptor.actions.CREATE) {
      if (options.createImmediately) {
        yield put(resource.creators.doCreate(yield select(descriptor.selectors.item)));
      } else {
        // Delayed create.
        yield put(descriptor.creators.doCreateSuccess(yield select(descriptor.selectors.item)));
      }
    } else if (action.type === descriptor.actions.CREATE_FAILURE) {
      yield put(resource.creators.doCreateFailure(action.payload.item, action.payload.reason));
    } else if (action.type === descriptor.actions.UPDATE) {
      if (options.createImmediately) {
        yield put(resource.creators.doUpdate(action.payload.item));
      } else {
        // Delayed create.
        yield put(resource.creators.doCreate(action.payload.item));
      }
    } else if (action.type === descriptor.actions.UPDATE_FAILURE) {
      yield put(resource.creators.doUpdateFailure(action.payload.item, action.payload.reason));
    } else if (action.type === descriptor.actions.DELETE) {
      yield put(resource.creators.doDelete(action.payload.item));
    } else if (action.type === descriptor.actions.DELETE_FAILURE) {
      yield put(resource.creators.doDeleteFailure(action.payload.item, action.payload.reason));
    } else if (action.type === resource.actions.CREATE_SUCCESS) {
      if (options.createImmediately) {
        const item = action.payload.item;
        const editing = yield select(descriptor.selectors.item);
        if (resource.hasSameId(editing, item)) {
          yield put(descriptor.creators.doCreateSuccess(item));
        }
      } else {
        // Delayed create.
        const item = action.payload.item;
        const editing = yield select(descriptor.selectors.item);
        if (resource.hasSameId(editing, item)) {
          yield put(descriptor.creators.doUpdateSuccess(item));
        }
      }
    } else if (action.type === resource.actions.READ_SUCCESS) {
      const item = action.payload.item;
      const editing = yield select(descriptor.selectors.item);
      if (resource.hasSameId(editing, item)) {
        yield put(descriptor.creators.doReadSuccess(item));
      }
    } else if (action.type === resource.actions.UPDATE_SUCCESS) {
      const item = action.payload.item;
      const editing = yield select(descriptor.selectors.item);
      if (resource.hasSameId(editing, item)) {
        yield put(descriptor.creators.doUpdateSuccess(item));
      }
    } else if (action.type === resource.actions.DELETE_SUCCESS) {
      const item = action.payload.item;
      const editing = yield select(descriptor.selectors.item);
      if (resource.hasSameId(editing, item)) {
        yield put(descriptor.creators.doDeleteSuccess(item));
      }
    }
  };
}

export default function makeSaga(descriptor, options, ...middlewares) {
  const {
    resource
  } = descriptor;
  const actions = [
    descriptor.actions.EDIT,
    descriptor.actions.SELECT,
    descriptor.actions.CREATE,
    descriptor.actions.CREATE_CANCEL,
    descriptor.actions.CREATE_SUCCESS,
    descriptor.actions.CREATE_FAILURE,
    descriptor.actions.READ,
    descriptor.actions.READ_CANCEL,
    descriptor.actions.READ_SUCCESS,
    descriptor.actions.READ_FAILURE,
    descriptor.actions.UPDATE,
    descriptor.actions.UPDATE_CANCEL,
    descriptor.actions.UPDATE_SUCCESS,
    descriptor.actions.UPDATE_FAILURE,
    descriptor.actions.DELETE,
    descriptor.actions.DELETE_CANCEL,
    descriptor.actions.DELETE_SUCCESS,
    descriptor.actions.DELETE_FAILURE,
    descriptor.actions.RESET,

    resource.actions.CREATE,
    resource.actions.CREATE_CANCEL,
    resource.actions.CREATE_SUCCESS,
    resource.actions.CREATE_FAILURE,
    resource.actions.READ,
    resource.actions.READ_CANCEL,
    resource.actions.READ_SUCCESS,
    resource.actions.READ_FAILURE,
    resource.actions.UPDATE,
    resource.actions.UPDATE_CANCEL,
    resource.actions.UPDATE_SUCCESS,
    resource.actions.UPDATE_FAILURE,
    resource.actions.DELETE,
    resource.actions.DELETE_CANCEL,
    resource.actions.DELETE_SUCCESS,
    resource.actions.DELETE_FAILURE,
    resource.actions.RESET
  ];
  const f = applyMiddlewares(...middlewares, defaultMiddleware(descriptor, options));
  return function* internal() {
    yield takeEvery(actions, f);
  }
}