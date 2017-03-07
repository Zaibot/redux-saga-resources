import { Action } from 'redux';

import { IResource } from '../resource';
import { IMiddleware } from '../utils/applyMiddlewares';

import makeEditorActions from './actions';
import makeEditorCreators from './creators';
import makeEditorReducer from './reducer';
import makeEditorSaga from './saga';
import makeEditorSelectors from './selectors';

export interface IActionMiddlewareFactory<T> {
  (descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action>;
}

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
  creating(state: any): boolean;
  reading(state: any): boolean;
  updating(state: any): boolean;
  deleting(state: any): boolean;
  error(state: any): string;
  item(state: any): T;
  original(item: T): (state: any) => T;
  isItem(item: T): (state: any) => boolean;
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
  reducer: (state: any, action: Action) => any;
  saga: () => any;
}

export function createEditor<T>(name: string, options: IEditorOptions, resource: IResource<T>, ...middlewares: Array<IActionMiddlewareFactory<T>>): IEditor<T> {
  if (!name) {
    throw new Error(`editor requires a name`);
  }
  if (!options) {
    throw new Error(`editor requires options`);
  }
  if (!resource) {
    throw new Error(`editor requires resource`);
  }

  options = {
    createImmediately: true,
    id: 'id',
    ...options,
  };

  const descriptor: IEditorDescriptor<T> = {
    resource,
    name,
    options,
    actions: makeEditorActions(name),
    creators: makeEditorCreators(name, makeEditorActions(name)),
    selectors: makeEditorSelectors(name, options, resource),
  };

  return {
    ...descriptor,
    resource,
    reducer: makeEditorReducer(descriptor, options),
    saga: makeEditorSaga(descriptor, options, middlewares),
  };
}
