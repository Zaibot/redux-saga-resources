import { Action } from 'redux';
import actionCreatorFactory, { ActionCreator, EmptyActionCreator } from 'redux-typescript-actions';
import { IResource } from '../resource';
import { IMiddleware } from '../utils/applyMiddlewares';

export interface IBatchActions<T> {
  APPLY: ActionCreator<{ item: T }>;

  CREATE: ActionCreator<{ items: T[] }>;
  CREATE_CANCEL: EmptyActionCreator;
  CREATE_CONTINUE: ActionCreator<{ item: T }>;

  READ: ActionCreator<{ items: T[] }>;
  READ_CANCEL: EmptyActionCreator;
  READ_CONTINUE: ActionCreator<{ items: T[], item: T }>;

  UPDATE: ActionCreator<{ items: T[] }>;
  UPDATE_CANCEL: EmptyActionCreator;
  UPDATE_CONTINUE: ActionCreator<{ items: T[], item: T }>;

  DELETE: ActionCreator<{ items: T[] }>;
  DELETE_CANCEL: EmptyActionCreator;
  DELETE_CONTINUE: ActionCreator<{ items: T[] }>;

  RESET: EmptyActionCreator;

  all: Array<ActionCreator<any>>;
}

export interface IBatchSelectors<T> {
  creating(state: any): boolean;
  reading(state: any): boolean;
  updating(state: any): boolean;
  deleting(state: any): boolean;
  item(state: any): T;
  sourceItems(state: any): T[];
}
export interface IBatchMerger<T> {
  combine(items: T[]): T;
  merge(item: T, items: T[]): T[];
}
export interface IBatchOptions<T> {
  createImmediately?: boolean;
  id?: string;
  merger?: IBatchMerger<T>;
}
export interface IBatchDescriptor<T> {
  name: string;
  options: IBatchOptions<T>;
  merger: IBatchMerger<T>;
  resource: IResource<T>;
  actions: IBatchActions<T>;
  selectors: IBatchSelectors<T>;
}
export interface IBatch<T> extends IBatchDescriptor<T> {
  reducer: (state: any, action: Action) => any;
  saga: () => any;
}

export interface ISagaMiddlewareFactory<T> {
  (descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>): IMiddleware<Action>;
}
