import { IResource } from '../resource';
import { IBatch, IBatchDescriptor, IBatchMerger, IBatchOptions, ISagaMiddlewareFactory } from './interfaces';

import { IMiddleware } from '../utils/applyMiddlewares';
import makeBatchActions from './actions';
import { Merger } from './merger';
import makeBatchReducer from './reducer';
import makeBatchSaga from './saga';
import makeBatchSelectors from './selectors';

export function createBatch<T>(name: string, options: IBatchOptions<T>, resource: IResource<T>, ...middlewares: Array<ISagaMiddlewareFactory<T>>): IBatch<T> {
  if (!name) {
    throw new Error(`batch requires a name`);
  }
  if (!options) {
    throw new Error(`batch requires options`);
  }
  if (!resource) {
    throw new Error(`batch requires resource`);
  }

  options = {
    createImmediately: true,
    id: 'id',
    ...options,
  };

  const descriptor: IBatchDescriptor<T> = {
    actions: makeBatchActions<T>(name),
    merger: options.merger || new Merger<T>(),
    name,
    options,
    resource,
    selectors: makeBatchSelectors<T>(name, options, resource),
  };

  return {
    ...descriptor,
    resource,
    reducer: makeBatchReducer(descriptor, options),
    saga: makeBatchSaga(descriptor, options, middlewares),
  };
}
