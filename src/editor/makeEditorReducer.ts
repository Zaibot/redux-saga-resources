import { Action } from 'redux';
import { IEditorDescriptor, IEditorOptions } from '.';
import { stripFields } from '../resource';

export function makeEditorReducer<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions) {
    type State = { creating: boolean, reading: boolean, updating: boolean, deleting: boolean, error: string, item: T };
    const emptyState: State = { creating: false, reading: false, updating: false, deleting: false, error: null, item: {} as any };

    const { actions } = descriptor;
    return (state = emptyState, action: Action | any) => {
        switch (action.type) {
            case actions.APPLY: {
                return { ...state, item: { ...(state.item as any), ...stripFields(action.payload.item || {}) } };
            }

            case actions.CREATE: {
                return { ...state, creating: true, reading: false, updating: false, deleting: false, item: descriptor.resource.create(action.payload.item) };
            }
            case actions.CREATE_CANCEL: {
                return { ...state, creating: false, item: {} };
            }
            case actions.CREATE_CONTINUE: {
                return { ...state, creating: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
            }

            case actions.READ: {
                return { ...state, creating: false, reading: true, updating: false, deleting: false, item: action.payload.item };
            }
            case actions.READ_CANCEL: {
                return { ...state, reading: false, item: {} };
            }
            case actions.READ_CONTINUE: {
                return { ...state, reading: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
            }

            case actions.UPDATE: {
                return { ...state, creating: false, reading: false, updating: true, deleting: false, item: action.payload.item };
            }
            case actions.UPDATE_CANCEL: {
                return { ...state, updating: false, item: {} };
            }
            case actions.UPDATE_CONTINUE: {
                return { ...state, updating: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
            }

            case actions.DELETE: {
                return { ...state, creating: false, reading: false, updating: false, deleting: true, item: action.payload.item };
            }
            case actions.DELETE_CANCEL: {
                return { ...state, deleting: false, item: {} };
            }
            case actions.DELETE_CONTINUE: {
                return { ...state, deleting: false, item: { ...(state.item as any), ...(action.payload.item as any) } };
            }

            case actions.RESET: {
                return { ...state, creating: false, reading: false, updating: false, deleting: false, error: null, item: {} };
            }
            default: {
                return state;
            }
        }
    };
}
