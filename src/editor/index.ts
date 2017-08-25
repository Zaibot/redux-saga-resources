import { Action } from 'redux';

import { IResource } from '../resource';
import { IMiddleware } from '../utils';

import { IFactory } from '@zaibot/fsa/es5';
import { makeEditorActions } from './makeEditorActions';
import { makeEditorReducer } from './makeEditorReducer';
import { makeEditorSaga } from './makeEditorSaga';
import { makeEditorSelectors } from './makeEditorSelectors';

export type IActionMiddlewareFactory<T> = (descriptor: IEditorDescriptor<T>, options: IEditorOptions) => IMiddleware<Action>;

export interface IEditorActions<T> {
  APPLY: IFactory<{ item: Partial<T> }, never>;

  CREATE: IFactory<{ item: Partial<T> }, never>;
  CREATE_CANCEL: IFactory<{ }, never>;
  CREATE_CONTINUE: IFactory<{ item: T }, never>;

  READ: IFactory<{ item: T }, never>;
  READ_CANCEL: IFactory<{ }, never>;
  READ_CONTINUE: IFactory<{ item: T }, never>;

  UPDATE: IFactory<{ item: T }, never>;
  UPDATE_CANCEL: IFactory<{ }, never>;
  UPDATE_CONTINUE: IFactory<{ item: T }, never>;

  DELETE: IFactory<{ item: T }, never>;
  DELETE_CANCEL: IFactory<{ }, never>;
  DELETE_CONTINUE: IFactory<{ item: T }, never>;

  RESET: IFactory<{ }, never>;

  all: Array<IFactory<any, never>>;
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
  actions: IEditorActions<T>;
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
