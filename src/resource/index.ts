import makeActions from './actions';
import makeCreators from './creators';
import makeDataSelectors from './dataSelectors';
import makeReducer from './reducer';
import makeSaga from './saga';
import makeSelectors from './selectors';
import { fields, selectors as fieldSelectors } from './fields';
import { makeTempKey, isTempKey } from '../utils/tempKey';

interface IActions {
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
}

interface ICreators {
    doCreate(item): any;
    doCreateCancel(item): any;
    doCreateSuccess(item): any;
    doCreateFailure(item, reason): any;

    doRead(item): any;
    doReadCancel(item): any;
    doReadSuccess(item): any;
    doReadFailure(item, reason): any;

    doUpdate(item): any;
    doUpdateCancel(item): any;
    doUpdateSuccess(item): any;
    doUpdateFailure(item, reason): any;

    doDelete(item): any;
    doDeleteCancel(item): any;
    doDeleteSuccess(item): any;
    doDeleteFailure(item, reason): any;

    doList(): any;
    doListCancel(): any;
    doListSuccess(list): any;
    doListFailure(reason): any;

    doReset(): any;
}

interface ISelectors {
    loading(state): boolean;
    error(state): string;
    items(state): any[];
    itemById(id): (state) => any;
    itemByItem(item): (state) => any;
}

interface IFieldSelectors {
    key(item): string;
    id(item): string;
    tempId(item): string;
    error(item): any;
    isModified(item): boolean;
    isReading(item): boolean;
    isRead(item): boolean;
    isCreating(item): boolean;
    isCreated(item): boolean;
    isRemoving(item): boolean;
    isRemoved(item): boolean;
    isUpdating(item): boolean;
    isUpdated(item): boolean;
    isUnchanged(item): boolean;
    isChanging(item): boolean;
    neverCommited(item): boolean;
    hasCommited(item): boolean;
}
interface IDataSelectors {
    id(item): any;
}

interface IResourceOptions {
    id?: string;
}

interface IResourceDescriptor {
    name: string;
    options: IResourceOptions;
    actions: IActions;
    creators: ICreators;
    selectors: ISelectors;
    fields: IFieldSelectors;
    data: IDataSelectors;
    hasSameId(left, right): boolean;
}
export interface IResource extends IResourceDescriptor {
    create(props): any;
    reducer: (state, action) => any;
    saga: () => any;
}

export interface IMiddlewareFactory {
    (resource: IResourceDescriptor): IMiddleware;
}
export interface IMiddleware {
    (action, next: (action?) => any);
}

export function createResource(name: string, options: IResourceOptions, ...middlewares: IMiddlewareFactory[]): IResource {
  options = {
    id: 'id',
    ...options
  }

  const descriptor: IResourceDescriptor = {
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
    create: (props) => ({ ...props,
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