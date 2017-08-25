import { takeEvery } from '@zaibot/fsa-saga';
import { fork } from 'redux-saga/effects';
import { IResourceDescriptor } from '.';
import { applyMiddlewares, IMiddleware } from '../utils';

function* noop(param: any): IterableIterator<any> {
  // Nothing
}

export function makeSaga<T>(descriptor: IResourceDescriptor<T>, ...middlewares: Array<IMiddleware<any>>) {
  const actions = [
    ...descriptor.actions.all,
  ];
  const f = applyMiddlewares(...middlewares);
  return function* internal(): any {
    yield takeEvery(actions, function*(action) {
      yield fork(() => f({ action, descriptor }, noop));
    });
  };
}
