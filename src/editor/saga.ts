import { takeEvery } from 'redux-saga';
import { call, take, race, put, select } from 'redux-saga/effects';
import { IEditor } from '.';

function applyMiddlewares(...middlewares) {
  return middlewares.slice(0).reverse().reduce((next, middleware) => {
    return function* (action) {
      yield* middleware(action, function* (a = action) {
        yield* next(a);
      });
    };
  }, function* (action) {
    console.error(`Reached end of middleware.`, action)
  });
}

function stopMiddleware<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    // Nothing.
  };
}

function resourceCreateImmediately<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.CREATE) {
      const item: T = yield select(descriptor.selectors.item);
      yield put(descriptor.resource.creators.doCreate(item));
    }
    yield* next(action);
  }
}
function resourceCreateDelayed<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.CREATE) {
      // Nothing, delegated to update delayed.
    }
    yield* next(action);
  }
}
function resourceCreateContinueImmediately<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.CREATE_CONTINUE) {
      const item: T = yield select(descriptor.selectors.item);
      yield put(descriptor.resource.creators.doUpdate(item));
    }
    yield* next(action);
  }
}
function resourceCreateContinueDelayed<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.CREATE_CONTINUE) {
      const item: T = yield select(descriptor.selectors.item);
      yield put(descriptor.resource.creators.doCreate(item));
    }
    yield* next(action);
  }
}
function resourceRead<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.READ) {
      const item: T = yield select(descriptor.resource.selectors.itemByItem(action.payload.item));
      yield put(descriptor.creators.doApply(item));
    }
    yield* next(action);
  }
}
function resourceUpdate<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.UPDATE) {
      const item: T = yield select(descriptor.resource.selectors.itemByItem(action.payload.item));
      yield put(descriptor.creators.doApply(item));
    }
    yield* next(action);
  }
}
function resourceUpdateContinueImmediately<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.UPDATE_CONTINUE) {
      const item: T = yield select(descriptor.selectors.item);
      yield put(descriptor.resource.creators.doUpdate(item));
    }
    yield* next(action);
  }
}
function resourceUpdateContinueDelayed<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.UPDATE_CONTINUE) {
      const item: T = yield select(descriptor.selectors.item);
      const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(action.payload.item));
      if (descriptor.resource.fields.isRead(storeItem)) {
        yield put(descriptor.resource.creators.doCreate(item));
      } else {
        yield put(descriptor.resource.creators.doUpdate(item));
      }
    }
    yield* next(action);
  }
}
function resourceDelete<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.DELETE) {
      const item: T = yield select(descriptor.resource.selectors.itemByItem(action.payload.item));
      yield put(descriptor.creators.doApply(item));
    }
    yield* next(action);
  }
}
function resourceDeleteContinue<T>(descriptor: IEditor<T>, options) {
  return function* (action, next) {
    if (action.type === descriptor.actions.DELETE_CONTINUE) {
      const item: T = yield select(descriptor.selectors.item);
      yield put(descriptor.resource.creators.doDelete(item));
    }
    yield* next(action);
  }
}

export default function makeSaga(descriptor, options, ...middlewares) {
  const {
    resource
  } = descriptor;
  const actions = [
    ...descriptor.actions.all,
    ...resource.actions.all
  ];
  const f = applyMiddlewares(...middlewares.concat(
    options.createImmediately ? resourceCreateImmediately : resourceCreateDelayed,
    options.createImmediately ? resourceCreateContinueImmediately : resourceCreateContinueDelayed,
    resourceRead,
    resourceUpdate,
    options.createImmediately ? resourceUpdateContinueImmediately : resourceUpdateContinueDelayed,
    resourceDelete,
    resourceDeleteContinue,
    stopMiddleware
  ).map(mw => mw(descriptor, options)));
  return function* internal(): any {
    yield takeEvery(actions, f);
  }
}