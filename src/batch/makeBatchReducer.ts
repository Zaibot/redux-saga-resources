import { IAction, isType } from '@zaibot/fsa';
import { IBatchDescriptor, IBatchOptions } from './interfaces';

export interface IState<T> {
  readonly creating: boolean;
  readonly deleting: boolean;
  readonly error: string;
  readonly item: Partial<T>;
  readonly items: T[];
  readonly reading: boolean;
  readonly updating: boolean;
}

export function makeBatchReducer<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  const { actions } = descriptor;
  const emptyState: IState<T> = {
    creating: false,
    deleting: false,
    error: null as string,
    item: {},
    items: [],
    reading: false,
    updating: false,
  };
  return (state = emptyState, action: IAction) => {
    if (isType(action, actions.APPLY)) {
      return {
        ...state, item: { ...(state.item as any), ...(action.payload.item as any) },
      };
    } else if (isType(action, actions.CREATE)) {
      return { ...state, creating: true, items: action.payload.items, item: {} };
    } else if (isType(action, actions.CREATE_CANCEL)) {
      return { ...state, creating: false, items: [], item: {} };
    } else if (isType(action, actions.CREATE_CONTINUE)) {
      return { ...state, creating: false };
    } else if (isType(action, actions.READ)) {
      return { ...state, reading: true, items: action.payload.items, item: {} };
    } else if (isType(action, actions.READ_CANCEL)) {
      return { ...state, reading: false, items: [], item: {} };
    } else if (isType(action, actions.READ_CONTINUE)) {
      return { ...state, reading: false };
    } else if (isType(action, actions.UPDATE)) {
      return { ...state, updating: true, items: action.payload.items, item: {} };
    } else if (isType(action, actions.UPDATE_CANCEL)) {
      return { ...state, updating: false, items: [], item: {} };
    } else if (isType(action, actions.UPDATE_CONTINUE)) {
      return { ...state, updating: false };
    } else if (isType(action, actions.DELETE)) {
      return { ...state, deleting: true, items: action.payload.items, item: {} };
    } else if (isType(action, actions.DELETE_CANCEL)) {
      return { ...state, deleting: false, items: [], item: {} };
    } else if (isType(action, actions.DELETE_CONTINUE)) {
      return { ...state, deleting: false };
    } else if (isType(action, actions.RESET)) {
      return { ...state, creating: false, reading: false, updating: false, deleting: false, items: [], item: {} };
    } else {
      return state;
    }
  };
}
