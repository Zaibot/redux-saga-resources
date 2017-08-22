import { Action } from 'redux';
import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { isType } from 'redux-typescript-actions';
import { IBatchDescriptor, IBatchOptions } from '.';
import { applyMiddlewares, IMiddleware } from '../utils';

function stopMiddleware<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  return <IMiddleware<any>>function* (action, next): Iterable<any> {
    // Nothing.
  };
}

function resourceUpdate<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  return <IMiddleware<any>>function* (action, next) {
    if (isType(action, descriptor.actions.UPDATE)) {
      // console.log(`resourceUpdate`, action);
      const item = descriptor.merger.combine(action.payload.items);
      yield put(descriptor.actions.APPLY({ item }));
    }
    yield* next(action);
  };
}
function resourceUpdateContinueImmediately<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  return <IMiddleware<any>>function* (action, next) {
    if (isType(action, descriptor.actions.UPDATE_CONTINUE)) {
      // console.log(`resourceUpdateContinueImmediately`, action);
      const items = descriptor.merger.merge(action.payload.item, action.payload.items);
      for (let i = 0, ii = items.length; i < ii; i++) {
        yield put(descriptor.resource.creators.doUpdate(items[i]));
      }
    }
    yield* next(action);
  };
}
function resourceUpdateContinueDelayed<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  return <IMiddleware<any>>function* (action, next) {
    if (isType(action, descriptor.actions.UPDATE_CONTINUE)) {
      // console.log(`resourceUpdateContinueDelayed`, action);
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

function resourceDelete<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  return <IMiddleware<any>>function* (action, next) {
    if (isType(action, descriptor.actions.DELETE)) {
      // console.log(`resourceDelete`, action);
      const item = descriptor.merger.combine(action.payload.items);
      yield put(descriptor.actions.APPLY({ item }));
    }
    yield* next(action);
  };
}
function resourceDeleteContinue<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  return <IMiddleware<any>>function* (action, next) {
    if (isType(action, descriptor.actions.DELETE_CONTINUE)) {
      // console.log(`resourceDeleteContinue`, action);
      const items = action.payload.items;
      for (let item of items) {
        yield put(descriptor.resource.creators.doDelete(item));
      }
    }
    yield* next(action);
  };
}

export interface IMiddlewareFactory<T> {
  (descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>): IMiddleware<any>;
}

export function makeBatchSaga<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>, middlewares: Array<IMiddlewareFactory<T>>) {
  const {
    resource,
  } = descriptor;
  const actions = [
    ...descriptor.actions.all.map((x: Action) => x.type),
    ...resource.actions.all,
  ];
  const wares = [...middlewares,
    resourceUpdate, options.createImmediately ? resourceUpdateContinueImmediately : resourceUpdateContinueDelayed,
    resourceDelete, resourceDeleteContinue,
    stopMiddleware,
  ];
  const compiled = wares.map((mw) => mw(descriptor, options));
  const f = applyMiddlewares<any>(...compiled);
  return function* internal(): any {
    yield takeEvery(actions, f as any);
  };
}
