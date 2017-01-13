import { IResource } from '../resource';

import makeEditorActions from './actions';
import makeEditorCreators from './creators';
import makeEditorSelectors from './selectors';
import makeEditorReducer from './reducer';
import makeEditorSaga from './saga';

interface IEditorActions {
    EDIT: string;
    SELECT: string;

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

    RESET: string;
}

interface IEditorCreators {
    doEdit(item): any;
    doSelect(item): any;

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

    doReset(): any;
}

interface IEditorSelectors {
    opened(state): boolean;
    loading(state): boolean;
    error(state): string;
    item(state): any;
    isItem(item): (state) => boolean;
}
interface IEditorOptions {
    createImmediately?: boolean;
    id?: string;
}
interface IEditorDescriptor {
    name: string;
    options: IEditorOptions;
    resource: IResource;
    actions: IEditorActions;
    creators: IEditorCreators;
    selectors: IEditorSelectors;
}
export interface IEditor extends IEditorDescriptor {
    reducer: (state, action) => any;
    saga: () => any;
}

export function createEditor(name: string, options: IEditorOptions, resource: IResource, ...middlewares): IEditor {
  options = {
    id: 'id',
    createImmediately: true,
    ...options
  }

  const descriptor: IEditorDescriptor = {
    resource: resource,
    name: name,
    options: options,
    actions: makeEditorActions(name),
    creators: makeEditorCreators(name, makeEditorActions(name)),
    selectors: makeEditorSelectors(name, options, resource),
  };

  return {
    ...descriptor,
    resource: resource,
    reducer: makeEditorReducer(descriptor, options),
    saga: makeEditorSaga(descriptor, options, ...middlewares.map(f => f(descriptor)))
  }
}
