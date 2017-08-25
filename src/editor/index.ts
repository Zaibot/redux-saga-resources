import { Action } from 'redux';

import { IResource } from '../resource';
import { IMiddleware } from '../utils';

import { makeEditorActions } from './makeEditorActions';
import { makeEditorCreators } from './makeEditorCreators';
import { makeEditorReducer } from './makeEditorReducer';
import { makeEditorSaga } from './makeEditorSaga';
import { makeEditorSelectors } from './makeEditorSelectors';

export type IActionMiddlewareFactory<T> = (descriptor: IEditorDescriptor<T>, options: IEditorOptions) => IMiddleware<Action>;

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
  doApply(item: T | any): Action;

  doCreate(item: T | any): Action;
  doCreateCancel(): Action;
  doCreateContinue(item: T): Action;

  doRead(item: T): Action;
  doReadCancel(): Action;
  doReadContinue(item: T): Action;

  doUpdate(item: T): Action;
  doUpdateCancel(): Action;
  doUpdateContinue(item: T): Action;

  doDelete(item: T): Action;
  doDeleteCancel(): Action;
  doDeleteContinue(item: T): Action;

  doReset(): Action;
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
  id?: any;
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
    actions: makeEditorActions(name),
    creators: makeEditorCreators(name, makeEditorActions(name)),
    name,
    options,
    resource,
    selectors: makeEditorSelectors(name, options, resource),
  };

  return {
    ...descriptor,
    reducer: makeEditorReducer(descriptor, options),
    resource,
    saga: makeEditorSaga(descriptor, options, middlewares),
  };
}
