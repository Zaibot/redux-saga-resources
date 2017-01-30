import makeActions from './actions';
import makeCreators from './creators';
import makeDataSelectors from './dataSelectors';
import makeReducer from './reducer';
import makeSaga from './saga';
import makeSelectors from './selectors';
import { fields, selectors as fieldSelectors, stripFields } from './fields';
import { makeTempKey, isTempKey } from '../utils/tempKey';

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
    doCreateFailure(item: T, reason): any;

    doRead(item: T): any;
    doReadCancel(item: T): any;
    doReadSuccess(item: T): any;
    doReadFailure(item: T, reason): any;

    doUpdate(item: T): any;
    doUpdateCancel(item: T): any;
    doUpdateSuccess(item: T): any;
    doUpdateFailure(item: T, reason): any;

    doDelete(item: T): any;
    doDeleteCancel(item: T): any;
    doDeleteSuccess(item: T): any;
    doDeleteFailure(item: T, reason): any;

    doList(params?: any): any;
    doListCancel(): any;
    doListSuccess(list: T[], params: any): any;
    doListFailure(reason, params: any): any;

    doReset(): any;
}

export interface ISelectors<T> {
    loading(state): boolean;
    error(state): string;
    items(state): T[];
    itemById(id): (state) => T;
    itemByItem(item: T): (state) => T;
    params(state): any;
}

export interface IFieldSelectors<T> {
    key(item: T): string;
    id(item: T): string;
    tempId(item: T): string;
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
    id?: string;
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
    create(props): any;
    reducer: (state, action) => any;
    saga: () => any;
}

export interface IMiddlewareFactory<T> {
    (resource: IResourceDescriptor<T>): IMiddleware;
}
export interface IMiddleware {
    (action, next: (action?) => any);
}

export function createResource<T>(name: string, options: IResourceOptions, ...middlewares: IMiddlewareFactory<T>[]): IResource<T> {
  if (!name) throw new Error(`resource requires a name`)
  if (!options) throw new Error(`resource requires options`)

  options = {
    id: 'id',
    ...options
  }

  const descriptor: IResourceDescriptor<T> = {
    name: name,
    data: makeDataSelectors(options),
    options: options,
    actions: makeActions(name),
    creators: makeCreators(name, makeActions(name)),
    selectors: makeSelectors(name, options, entityHasSameId(options)),
    fields: fieldSelectors,
    hasSameId: entityHasSameId(options)
  };

  return {
    ...descriptor,
    hasSameId: descriptor.hasSameId,
    create: (props) => ({
      ...stripFields(props),
      [fields.tempId]: makeTempKey()
    }),
    reducer: makeReducer(descriptor),
    saga: makeSaga(descriptor, ...middlewares.map(f => f(descriptor)))
  }
}

function entityHasSameId(options) {
  const { id: internalId, tempId } = fields;
  const { id } = options;
  var leftId, rightId;

  return (left, right) => {
    if (left === right) return true;
    if (left && right) {
      // Internal ID
      leftId = left[internalId];
      rightId = right[internalId];
      if (leftId && (leftId === rightId)) return true;

      // Object ID
      if (id) {
        leftId = left[id];
        rightId = right[id];
        if (leftId && (leftId === rightId)) return true;
      }

      // Temporary ID
      leftId = left[tempId];
      rightId = right[tempId];
      if (leftId && (leftId === rightId)) return true;
    }
    return false;
  };
}
