import { isType } from '@zaibot/fsa/es5';
import { Action } from 'redux';
import { IEditorDescriptor, IEditorOptions } from '.';
import { stripFields } from '../resource';

export interface IState<T> {
    readonly creating: boolean;
    readonly deleting: boolean;
    readonly error: string;
    readonly item: T;
    readonly reading: boolean;
    readonly updating: boolean;
}

export function makeEditorReducer<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions) {
    const emptyState: IState<T> = {
        creating: false,
        deleting: false,
        error: null,
        item: {} as T,
        reading: false,
        updating: false,
    };

    const { actions } = descriptor;
    return (state = emptyState, action: Action | any): IState<T> => {
        if (isType(action, actions.APPLY)) {
            return { ...state, item: { ...(state.item as any), ...(stripFields(action.payload.item) as any) } };
        } else if (isType(action, actions.CREATE)) {
            return { ...state, creating: true, reading: false, updating: false, deleting: false, item: descriptor.resource.create(action.payload.item) };
        } else if (isType(action, actions.CREATE_CANCEL)) {
            return { ...state, creating: false, item: {} as T };
        } else if (isType(action, actions.CREATE_CONTINUE)) {
            return { ...state, creating: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
        } else if (isType(action, actions.READ)) {
            return { ...state, creating: false, reading: true, updating: false, deleting: false, item: action.payload.item };
        } else if (isType(action, actions.READ_CANCEL)) {
            return { ...state, reading: false, item: {} as T };
        } else if (isType(action, actions.READ_CONTINUE)) {
            return { ...state, reading: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
        } else if (isType(action, actions.UPDATE)) {
            return { ...state, creating: false, reading: false, updating: true, deleting: false, item: action.payload.item };
        } else if (isType(action, actions.UPDATE_CANCEL)) {
            return { ...state, updating: false, item: {} as T };
        } else if (isType(action, actions.UPDATE_CONTINUE)) {
            return { ...state, updating: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
        } else if (isType(action, actions.DELETE)) {
            return { ...state, creating: false, reading: false, updating: false, deleting: true, item: action.payload.item };
        } else if (isType(action, actions.DELETE_CANCEL)) {
            return { ...state, deleting: false, item: {} as T };
        } else if (isType(action, actions.DELETE_CONTINUE)) {
            return { ...state, deleting: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
        } else if (isType(action, actions.RESET)) {
            return { ...state, creating: false, reading: false, updating: false, deleting: false, error: null, item: {} as T };
        } else {
            return state;
        }
    };
}
