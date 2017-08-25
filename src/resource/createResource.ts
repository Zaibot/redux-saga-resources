import { makeTempKey } from '../utils';
import { entityHasSameId } from './entityHasSameId';
import { fields, selectors, stripFields } from './fields';
import { IMiddlewareFactory } from './IMiddlewareFactory';
import { IResource } from './IResource';
import { IResourceDescriptor } from './IResourceDescriptor';
import { IResourceOptions } from './IResourceOptions';
import { makeActions } from './makeActions';
import { makeCreators } from './makeCreators';
import { makeDataSelectors } from './makeDataSelectors';
import { makeReducer } from './makeReducer';
import { makeSaga } from './makeSaga';
import { makeSelectors } from './makeSelectors';

export function createResource<T>(name: string, options: IResourceOptions, ...middlewares: Array<IMiddlewareFactory<T>>): IResource<T> {
  if (!name) {
    throw new Error(`resource requires a name`);
  }
  if (!options) {
    throw new Error(`resource requires options`);
  }

  options = {
    id: 'id',
    ...options,
  };

  const descriptor: IResourceDescriptor<T> = {
    actions: makeActions(name),
    creators: makeCreators<T>(name, makeActions(name)),
    data: makeDataSelectors<T>(options),
    fields: selectors,
    hasSameId: entityHasSameId(options),
    name,
    options,
    selectors: makeSelectors<T>(name, options, entityHasSameId(options)),
  };

  return {
    ...descriptor,
    create: (props) => ({
      ...stripFields(props),
      [fields.tempId]: makeTempKey(),
    }),
    hasSameId: descriptor.hasSameId,
    reducer: makeReducer(descriptor),
    saga: makeSaga(descriptor, ...middlewares.map((f) => f(descriptor))),
  };
}
