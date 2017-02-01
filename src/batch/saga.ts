import { takeEvery } from 'redux-saga';
import { call, take, race, put, select } from 'redux-saga/effects';
import { IBatch } from '.';
import { ActionCreator, isType } from 'redux-typescript-actions';

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

function stopMiddleware<T>(descriptor: IBatch<T>, options) {
  return function* (action, next) {
    // Nothing.
  };
}

function interceptor<T>(descriptor: IBatch<T>, actionType: ActionCreator<any>, cb: (action, items: T[], item: T) => IterableIterator<any>) {
  return function* (action, next) {
    if (isType(action, actionType)) {
      const item: T = yield select(descriptor.selectors.item);
      const items: T[] = yield select(descriptor.selectors.sourceItems);
      yield* cb(action, items, item);
    }
    yield* next(action);
  };
};

function resourceUpdate<T>(descriptor: IBatch<T>, options) {
  return function* (action, next) {
    if (isType(action, descriptor.actions.UPDATE)) {
      console.log(`resourceUpdate`, action);
      const item = descriptor.merger.combine(action.payload.items);
      yield put(descriptor.actions.APPLY({ item: item }));
    }
    yield* next(action);
  };
}
function resourceUpdateContinueImmediately<T>(descriptor: IBatch<T>, options) {
  return function* (action, next) {
    if (isType(action, descriptor.actions.UPDATE_CONTINUE)) {
      console.log(`resourceUpdateContinueImmediately`, action);
      const items = descriptor.merger.merge(action.payload.item, action.payload.items);
      for (let i = 0, ii = items.length; i < ii; i++) {
        yield put(descriptor.resource.creators.doUpdate(items[i]));
      }
    }
    yield* next(action);
  };
}
function resourceUpdateContinueDelayed<T>(descriptor: IBatch<T>, options) {
  return function* (action, next) {
    if (isType(action, descriptor.actions.UPDATE_CONTINUE)) {
      console.log(`resourceUpdateContinueDelayed`, action);
      const items = descriptor.merger.merge(action.payload.item, action.payload.items);
      for (let i = 0, ii = items.length; i < ii; i++) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(items[i]));
        if (storeItem && descriptor.resource.fields.hasCommited(storeItem)) {
          yield put(descriptor.resource.creators.doUpdate(items[i]));
        } else {
          yield put(descriptor.resource.creators.doCreate(items[i]));
        }
      }
    }
    yield* next(action);
  };
}


function resourceDelete<T>(descriptor: IBatch<T>, options) {
  return function* (action, next) {
    if (isType(action, descriptor.actions.DELETE)) {
      console.log(`resourceDelete`, action);
      const item = descriptor.merger.combine(action.payload.items);
      yield put(descriptor.actions.APPLY({ item: item }));
    }
    yield* next(action);
  };
}
function resourceDeleteContinue<T>(descriptor: IBatch<T>, options) {
  return function* (action, next) {
    if (isType(action, descriptor.actions.DELETE_CONTINUE)) {
      console.log(`resourceDeleteContinue`, action);
      const items = action.payload.items;
      for (var item of items) {
        yield put(descriptor.resource.creators.doDelete(item));
      }
    }
    yield* next(action);
  };
}

export default function makeSaga(descriptor, options, ...middlewares) {
  const {
    resource
  } = descriptor;
  const actions = [
    ...descriptor.actions.all.map(x => x.type),
    ...resource.actions.all
  ];
  const f = applyMiddlewares(...middlewares.concat(
    resourceUpdate, options.createImmediately ? resourceUpdateContinueImmediately : resourceUpdateContinueDelayed,
    resourceDelete, resourceDeleteContinue,
    stopMiddleware
  ).map(mw => mw(descriptor, options)));
  return function* internal(): any {
    yield takeEvery(actions, f);
  }
}
