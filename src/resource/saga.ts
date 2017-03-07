import { takeEvery } from 'redux-saga';
import { call, fork } from 'redux-saga/effects';
import { IResourceDescriptor } from '.';
import applyMiddlewares, { IMiddleware } from '../utils/applyMiddlewares';

function* noop(param: any): IterableIterator<any> {
  // Nothing
};

export default function makeSaga<T>(descriptor: IResourceDescriptor<T>, ...middlewares: Array<IMiddleware<any>>) {
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
