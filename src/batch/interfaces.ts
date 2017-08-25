import { IAction, IFactory } from '@zaibot/fsa';
import { IResource } from '../resource';
import { IMiddleware } from '../utils';

// tslint:disable-next-line:no-unused-variable
export interface IBatchActions<T> {
  APPLY: IFactory<{ item: Partial<T> }, never>;

  CREATE: IFactory<{ items: T[] }, never>;
  CREATE_CANCEL: IFactory<{ }, never>;
  CREATE_CONTINUE: IFactory<{ item: T }, never>;

  READ: IFactory<{ items: T[] }, never>;
  READ_CANCEL: IFactory<{ }, never>;
  READ_CONTINUE: IFactory<{ items: T[], item: T }, never>;

  UPDATE: IFactory<{ items: T[] }, never>;
  UPDATE_CANCEL: IFactory<{ }, never>;
  UPDATE_CONTINUE: IFactory<{ items: T[], item: T }, never>;

  DELETE: IFactory<{ items: T[] }, never>;
  DELETE_CANCEL: IFactory<{ }, never>;
  DELETE_CONTINUE: IFactory<{ items: T[] }, never>;

  RESET: IFactory<{ }, never>;

  all: Array<IFactory<any, never>>;
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
  reducer: (state: any, action: IAction) => any;
  saga: () => any;
}

export type ISagaMiddlewareFactory<T> = (descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) => IMiddleware<IAction>;
