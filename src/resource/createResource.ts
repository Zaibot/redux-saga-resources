import { makeTempKey } from '../utils';
import { IResourceOptions } from "./IResourceOptions";
import { IMiddlewareFactory } from "./IMiddlewareFactory";
import { IResource } from "./IResource";
import { makeActions } from "./makeActions";
import { makeCreators } from "./makeCreators";
import { makeDataSelectors } from "./makeDataSelectors";
import { fields, stripFields, selectors } from './fields';
import { IResourceDescriptor } from "./IResourceDescriptor";
import { entityHasSameId } from "./entityHasSameId";
import { makeSelectors } from "./makeSelectors";
import { makeReducer } from "./makeReducer";
import { makeSaga } from "./makeSaga";

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
    name,
    options,
    actions: makeActions(name),
    creators: makeCreators<T>(name, makeActions(name)),
    data: makeDataSelectors<T>(options),
    fields: selectors,
    hasSameId: entityHasSameId(options),
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