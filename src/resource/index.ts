import { Action } from 'redux';
import { IMiddleware } from '../utils/applyMiddlewares';
import { makeTempKey } from '../utils/tempKey';
import makeActions from './actions';
import makeCreators from './creators';
import makeDataSelectors from './dataSelectors';
import { fields, selectors as fieldSelectors, stripFields } from './fields';
import makeReducer from './reducer';
import makeSaga from './saga';
import makeSelectors from './selectors';

export type Status = false | { time: number };

export interface IActions {
  CREATE: string;
  CREATE_CANCEL: string;
  CREATE_SUCCESS: string;
  CREATE_FAILURE: string;

  READ: string;
  READ_CANCEL: string;
  READ_SUCCESS: string;
  READ_FAILURE: string;

  UPDATE: string;
  UPDATE_CANCEL: string;
  UPDATE_SUCCESS: string;
  UPDATE_FAILURE: string;

  DELETE: string;
  DELETE_CANCEL: string;
  DELETE_SUCCESS: string;
  DELETE_FAILURE: string;

  LIST: string;
  LIST_CANCEL: string;
  LIST_SUCCESS: string;
  LIST_FAILURE: string;

  RESET: string;

  all: string[];
}

export interface ICreators<T> {
  doCreate(item: T): any;
  doCreateCancel(item: T): any;
  doCreateSuccess(item: T): any;
  doCreateFailure(item: T, reason: string): any;

  doRead(item: T): any;
  doReadCancel(item: T): any;
  doReadSuccess(item: T): any;
  doReadFailure(item: T, reason: string): any;

  doUpdate(item: T): any;
  doUpdateCancel(item: T): any;
  doUpdateSuccess(item: T): any;
  doUpdateFailure(item: T, reason: string): any;

  doDelete(item: T): any;
  doDeleteCancel(item: T): any;
  doDeleteSuccess(item: T): any;
  doDeleteFailure(item: T, reason: string): any;

  doList(params?: any): any;
  doListCancel(): any;
  doListSuccess(list: T[], params: any): any;
  doListFailure(reason: string, params: any): any;

  doReset(): any;
}

export interface ISelectors<T> {
  loading(state: any): boolean;
  error(state: any): string;
  items(state: any): T[];
  itemById(id: string): (state: any) => T;
  itemByItem(item: T): (state: any) => T;
  params(state: any): any;
}

export interface IFieldSelectors<T> {
  key(item: T): string;
  id(item: T): any;
  tempId(item: T): any;
  error(item: T): any;
  isModified(item: T): Status;
  isReading(item: T): Status;
  isRead(item: T): Status;
  isCreating(item: T): Status;
  isCreated(item: T): Status;
  isRemoving(item: T): Status;
  isRemoved(item: T): Status;
  isUpdating(item: T): Status;
  isUpdated(item: T): Status;
  isUnchanged(item: T): boolean;
  isChanging(item: T): boolean;
  neverCommited(item: T): boolean;
  hasCommited(item: T): boolean;
}
export interface IDataSelectors<T> {
  id(item: T): any;
}

export interface IResourceOptions {
  id?: any;
}

export interface IResourceDescriptor<T> {
  name: string;
  options: IResourceOptions;
  actions: IActions;
  creators: ICreators<T>;
  selectors: ISelectors<T>;
  fields: IFieldSelectors<T>;
  data: IDataSelectors<T>;
  hasSameId(left: T, right: T): boolean;
}
export interface IResource<T> extends IResourceDescriptor<T> {
  create(props: T|any): any;
  reducer(state: any, action: Action): any;
  saga(): any;
}

export interface IMiddlewareFactory<T> {
  (resource: IResourceDescriptor<T>): IMiddleware<any>;
}

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
    fields: fieldSelectors,
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

function entityHasSameId<T>(options: IResourceOptions) {
  const { id: internalId, tempId } = fields;
  const { id } = options;
  let leftId: string;
  let rightId: string;

  return (left: T, right: T) => {
    if (left === right) {
      return true;
    }
    if (left && right) {
      // Internal ID
      leftId = left[internalId];
      rightId = right[internalId];
      if (leftId && (leftId === rightId)) {
        return true;
      }

      // Object ID
      if (id) {
        leftId = left[id];
        rightId = right[id];
        if (leftId && (leftId === rightId)) {
          return true;
        }
      }

      // Temporary ID
      leftId = left[tempId];
      rightId = right[tempId];
      if (leftId && (leftId === rightId)) {
        return true;
      }
    }
    return false;
  };
}
