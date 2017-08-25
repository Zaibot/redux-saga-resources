import { IResource } from '../resource';
import { IBatch, IBatchDescriptor, IBatchOptions, ISagaMiddlewareFactory } from './interfaces';
import { makeBatchActions } from './makeBatchActions';
import { makeBatchReducer } from './makeBatchReducer';
import { makeBatchSaga } from './makeBatchSaga';
import { makeBatchSelectors } from './makeBatchSelectors';
import { Merger } from './merger';

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
    reducer: makeBatchReducer(descriptor, options),
    resource,
    saga: makeBatchSaga(descriptor, options, middlewares),
  };
}
