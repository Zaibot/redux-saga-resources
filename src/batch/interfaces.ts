import actionCreatorFactory, { EmptyActionCreator, ActionCreator } from 'redux-typescript-actions';
import { IResource } from '../resource';

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

    all: ActionCreator<any>[];
}

export interface IBatchSelectors<T> {
    creating(state): boolean;
    reading(state): boolean;
    updating(state): boolean;
    deleting(state): boolean;
    item(state): T;
    sourceItems(state): T;
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
    reducer: (state, action) => any;
    saga: () => any;
}
