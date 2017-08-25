import { Action } from '@zaibot/fsa';
import { internal } from '../utils';
import { IEditorActions } from './index';

export function makeEditorActions<T>(name: string): IEditorActions<T> {
    const res = {
        APPLY: Action<{ item: Partial<T> }, never>(internal(`EDITOR/APPLY_${name.toUpperCase()}`)),

        CREATE: Action<{ item: Partial<T> }, never>(internal(`EDITOR/CREATE_${name.toUpperCase()}`)),
        CREATE_CANCEL: Action<never, never>(internal(`EDITOR/CREATE_${name.toUpperCase()}_CANCEL`)),
        CREATE_CONTINUE: Action<{ item: T }, never>(internal(`EDITOR/CREATE_${name.toUpperCase()}_CONTINUE`)),

        DELETE: Action<{ item: T }, never>(internal(`EDITOR/DELETE_${name.toUpperCase()}`)),
        DELETE_CANCEL: Action<never, never>(internal(`EDITOR/DELETE_${name.toUpperCase()}_CANCEL`)),
        DELETE_CONTINUE: Action<{ item: T }, never>(internal(`EDITOR/DELETE_${name.toUpperCase()}_CONTINUE`)),

        READ: Action<{ item: T }, never>(internal(`EDITOR/READ_${name.toUpperCase()}`)),
        READ_CANCEL: Action<never, never>(internal(`EDITOR/READ_${name.toUpperCase()}_CANCEL`)),
        READ_CONTINUE: Action<{ item: T }, never>(internal(`EDITOR/READ_${name.toUpperCase()}_SUCCESS`)),

        RESET: Action<never, never>(internal(`EDITOR/RESET_${name.toUpperCase()}`)),

        UPDATE: Action<{ item: T }, never>(internal(`EDITOR/UPDATE_${name.toUpperCase()}`)),
        UPDATE_CANCEL: Action<never, never>(internal(`EDITOR/UPDATE_${name.toUpperCase()}_CANCEL`)),
        UPDATE_CONTINUE: Action<{ item: T }, never>(internal(`EDITOR/UPDATE_${name.toUpperCase()}_CONTINUE`)),
    };
    const all = [
        res.APPLY,
        res.CREATE,
        res.CREATE_CANCEL,
        res.CREATE_CONTINUE,
        res.DELETE,
        res.DELETE_CANCEL,
        res.DELETE_CONTINUE,
        res.READ,
        res.READ_CANCEL,
        res.READ_CONTINUE,
        res.RESET,
        res.UPDATE,
        res.UPDATE_CANCEL,
        res.UPDATE_CONTINUE,
    ];
    return { ...res, all };
}
