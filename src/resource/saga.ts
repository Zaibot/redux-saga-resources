import { takeEvery } from 'redux-saga';
import { call, fork } from 'redux-saga/effects';

function applyMiddlewares(...middlwares) {
  return middlwares.slice(0).reverse().reduce((next, middleware) => {
    return function*(action) {
      yield* middleware(action, function* (a = action) {
        yield* next(a);
      });
    };
  }, function*(action) {
    console.debug(`Reached end of middleware.`, action)
  });
}

export default function makeSaga(descriptor, ...middlewares) {
  const actions = [
    ...descriptor.actions.all,
  ];
  const f = applyMiddlewares(...middlewares);
  return function* internal(): any {
    yield takeEvery(actions, function* (action) {
      yield call(f, { action, descriptor })
    });
  }
}
