import { IAction, isType } from '../actions/creator';
import { IBatchDescriptor, IBatchOptions } from './interfaces';

export function makeBatchReducer<T>(descriptor: IBatchDescriptor<T>, options: IBatchOptions<T>) {
  const { actions } = descriptor;
  const emptyState = {
    creating: false,
    deleting: false,
    error: null as string,
    item: {} as T,
    items: [] as T[],
    reading: false,
    updating: false,
  };
  return (state = emptyState, action: IAction<any>) => {
    if (isType(action, actions.APPLY)) {
      return {
        ...state, item: { ...(state.item as any), ...(action.payload.item as any) },
      };
    }

    if (isType(action, actions.CREATE)) {
      return { ...state, creating: true, items: action.payload.items, item: {} };
    }
    if (isType(action, actions.CREATE_CANCEL)) {
      return { ...state, creating: false, items: [], item: {} };
    }
    if (isType(action, actions.CREATE_CONTINUE)) {
      return { ...state, creating: false };
    }

    if (isType(action, actions.READ)) {
      return { ...state, reading: true, items: action.payload.items, item: {} };
    }
    if (isType(action, actions.READ_CANCEL)) {
      return { ...state, reading: false, items: [], item: {} };
    }
    if (isType(action, actions.READ_CONTINUE)) {
      return { ...state, reading: false };
    }

    if (isType(action, actions.UPDATE)) {
      return { ...state, updating: true, items: action.payload.items, item: {} };
    }
    if (isType(action, actions.UPDATE_CANCEL)) {
      return { ...state, updating: false, items: [], item: {} };
    }
    if (isType(action, actions.UPDATE_CONTINUE)) {
      return { ...state, updating: false };
    }

    if (isType(action, actions.DELETE)) {
      return { ...state, deleting: true, items: action.payload.items, item: {} };
    }
    if (isType(action, actions.DELETE_CANCEL)) {
      return { ...state, deleting: false, items: [], item: {} };
    }
    if (isType(action, actions.DELETE_CONTINUE)) {
      return { ...state, deleting: false };
    }

    if (isType(action, actions.RESET)) {
      return { ...state, creating: false, reading: false, updating: false, deleting: false, items: [], item: {} };
    }

    return state;
  };
}
