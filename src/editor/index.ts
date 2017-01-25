import { IResource } from '../resource';

import makeEditorActions from './actions';
import makeEditorCreators from './creators';
import makeEditorSelectors from './selectors';
import makeEditorReducer from './reducer';
import makeEditorSaga from './saga';

export interface IEditorActions {
    APPLY: string;

    CREATE: string;
    CREATE_CANCEL: string;
    CREATE_CONTINUE: string;

    READ: string;
    READ_CANCEL: string;
    READ_CONTINUE: string;

    UPDATE: string;
    UPDATE_CANCEL: string;
    UPDATE_CONTINUE: string;

    DELETE: string;
    DELETE_CANCEL: string;
    DELETE_CONTINUE: string;

    RESET: string;

    all: string[];
}

export interface IEditorCreators<T> {
    doApply(item: T | any): any;

    doCreate(item: T | any): any;
    doCreateCancel(): any;
    doCreateContinue(item: T): any;

    doRead(item: T): any;
    doReadCancel(): any;
    doReadContinue(item: T): any;

    doUpdate(item: T): any;
    doUpdateCancel(): any;
    doUpdateContinue(item: T): any;

    doDelete(item: T): any;
    doDeleteCancel(): any;
    doDeleteContinue(item: T): any;

    doReset(): any;
}

export interface IEditorSelectors<T> {
    creating(state): boolean;
    reading(state): boolean;
    updating(state): boolean;
    deleting(state): boolean;
    error(state): string;
    item(state): T;
    isItem(item): (state) => boolean;
}
export interface IEditorOptions {
    createImmediately?: boolean;
    id?: string;
}
export interface IEditorDescriptor<T> {
    name: string;
    options: IEditorOptions;
    resource: IResource<T>;
    actions: IEditorActions;
    creators: IEditorCreators<T>;
    selectors: IEditorSelectors<T>;
}
export interface IEditor<T> extends IEditorDescriptor<T> {
    reducer: (state, action) => any;
    saga: () => any;
}

export function createEditor<T>(name: string, options: IEditorOptions, resource: IResource<T>, ...middlewares): IEditor<T> {
  if (!name) throw new Error(`editor requires a name`)
  if (!options) throw new Error(`editor requires options`)
  if (!resource) throw new Error(`editor requires resource`)

  options = {
    id: 'id',
    createImmediately: true,
    ...options
  }

  const descriptor: IEditorDescriptor<T> = {
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
