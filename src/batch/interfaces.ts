import { Action } from 'redux';
import { Factory } from '../actions/creator';
import { IResource } from '../resource';
import { IMiddleware } from '../utils';

export interface IBatchActions<T> {
  APPLY: Factory<{ item: T }>;

  CREATE: Factory<{ items: T[] }>;
  CREATE_CANCEL: Factory<{ }>;
  CREATE_CONTINUE: Factory<{ item: T }>;

  READ: Factory<{ items: T[] }>;
  READ_CANCEL: Factory<{}>;
  READ_CONTINUE: Factory<{ items: T[], item: T }>;

  UPDATE: Factory<{ items: T[] }>;
  UPDATE_CANCEL: Factory<{ }>;
  UPDATE_CONTINUE: Factory<{ items: T[], item: T }>;

  DELETE: Factory<{ items: T[] }>;
  DELETE_CANCEL: Factory<{ }>;
  DELETE_CONTINUE: Factory<{ items: T[] }>;

  RESET: Factory<{ }>;

  all: Array<Factory<any>>;
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
  id?: any;
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

export type ISagaMiddlewareFactory<T> = (descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) => IMiddleware<Action>;
