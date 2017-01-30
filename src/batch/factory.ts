import { IResource } from '../resource';
import { IBatchDescriptor, IBatchOptions, IBatch, IBatchMerger } from './interfaces';

import makeBatchActions from './actions';
import makeBatchSelectors from './selectors';
import makeBatchReducer from './reducer';
import makeBatchSaga from './saga';
import { Merger } from './merger';

export function createBatch<T>(name: string, options: IBatchOptions<T>, resource: IResource<T>, ...middlewares): IBatch<T> {
  if (!name) throw new Error(`batch requires a name`)
  if (!options) throw new Error(`batch requires options`)
  if (!resource) throw new Error(`batch requires resource`)

  options = {
    id: 'id',
    createImmediately: true,
    ...options
  }

  const descriptor: IBatchDescriptor<T> = {
    merger: options.merger || new Merger<T>(),
    resource: resource,
    name: name,
    options: options,
    actions: makeBatchActions(name),
    selectors: makeBatchSelectors<T>(name, options, resource),
  };

  return {
    ...descriptor,
    resource: resource,
    reducer: makeBatchReducer(descriptor, options),
    saga: makeBatchSaga(descriptor, options, ...middlewares.map(f => f(descriptor)))
  }
}
