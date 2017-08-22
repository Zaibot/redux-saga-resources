import { takeEvery } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { IResourceDescriptor } from '.';
import { IMiddleware, applyMiddlewares } from '../utils';

function* noop(param: any): IterableIterator<any> {
  // Nothing
};

export function makeSaga<T>(descriptor: IResourceDescriptor<T>, ...middlewares: Array<IMiddleware<any>>) {
  const actions = [
    ...descriptor.actions.all,
  ];
  const f = applyMiddlewares(...middlewares);
  return function* internal(): any {
    yield takeEvery(actions, function* (action) {
      yield fork(() => f({ action, descriptor }, noop));
    });
  };
}