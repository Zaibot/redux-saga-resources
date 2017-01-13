import { call, fork, takeEvery } from 'redux-saga/effects';

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
    descriptor.actions.LIST,
    descriptor.actions.LIST_CANCEL,
    descriptor.actions.LIST_SUCCESS,
    descriptor.actions.LIST_FAILURE,
    descriptor.actions.RESET,
  ];
  const f = applyMiddlewares(...middlewares);
  return function* internal() {
    yield takeEvery(actions, f);
  }
}
