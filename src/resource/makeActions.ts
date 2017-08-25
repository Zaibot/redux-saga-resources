import { Action } from '@zaibot/fsa/es5';
import { internal } from '../utils';
import { IActions } from './IActions';

export function makeActions<T>(name: string): IActions<T> {
    const res = {
        CREATE: Action<{ item: T; }, never>(internal(`RESOURCE/CREATE_${name.toUpperCase()}`)),
        CREATE_CANCEL: Action<{ item: T; }, never>(internal(`RESOURCE/CREATE_${name.toUpperCase()}_CANCEL`)),
        CREATE_FAILURE: Action<{ item: T; reason: string; }, never>(internal(`RESOURCE/CREATE_${name.toUpperCase()}_FAILURE`)),
        CREATE_SUCCESS: Action<{ item: T; }, never>(internal(`RESOURCE/CREATE_${name.toUpperCase()}_SUCCESS`)),

        DELETE: Action<{ item: T; }, never>(internal(`RESOURCE/DELETE_${name.toUpperCase()}`)),
        DELETE_CANCEL: Action<{ item: T; }, never>(internal(`RESOURCE/DELETE_${name.toUpperCase()}_CANCEL`)),
        DELETE_FAILURE: Action<{ item: T; reason: string; }, never>(internal(`RESOURCE/DELETE_${name.toUpperCase()}_FAILURE`)),
        DELETE_SUCCESS: Action<{ item: T; }, never>(internal(`RESOURCE/DELETE_${name.toUpperCase()}_SUCCESS`)),

        LIST: Action<{ params?: any; }, never>(internal(`RESOURCE/LIST_${name.toUpperCase()}`)),
        LIST_CANCEL: Action<never, never>(internal(`RESOURCE/LIST_${name.toUpperCase()}_CANCEL`)),
        LIST_FAILURE: Action<{ item: T; reason: string; }, never>(internal(`RESOURCE/LIST_${name.toUpperCase()}_FAILURE`)),
        LIST_SUCCESS: Action<{ list: T[], params: any; }, never>(internal(`RESOURCE/LIST_${name.toUpperCase()}_SUCCESS`)),

        READ: Action<{ item: T; }>(internal(`RESOURCE/READ_${name.toUpperCase()}`)),
        READ_CANCEL: Action<never, never>(internal(`RESOURCE/READ_${name.toUpperCase()}_CANCEL`)),
        READ_FAILURE: Action<{ item: T; reason: string; }, never>(internal(`RESOURCE/READ_${name.toUpperCase()}_FAILURE`)),
        READ_SUCCESS: Action<{ item: T; }, never>(internal(`RESOURCE/READ_${name.toUpperCase()}_SUCCESS`)),

        RESET: Action<never, never>(internal(`RESOURCE/RESET_${name.toUpperCase()}`)),

        UPDATE: Action<{ item: T; }, never>(internal(`RESOURCE/UPDATE_${name.toUpperCase()}`)),
        UPDATE_CANCEL: Action<never, never>(internal(`RESOURCE/UPDATE_${name.toUpperCase()}_CANCEL`)),
        UPDATE_FAILURE: Action<{ item: T; reason: string; }, never>(internal(`RESOURCE/UPDATE_${name.toUpperCase()}_FAILURE`)),
        UPDATE_SUCCESS: Action<{ item: T; }, never>(internal(`RESOURCE/UPDATE_${name.toUpperCase()}_SUCCESS`)),
    };

    const all = [
        res.CREATE,
        res.CREATE_CANCEL,
        res.CREATE_FAILURE,
        res.CREATE_SUCCESS,
        res.DELETE,
        res.DELETE_CANCEL,
        res.DELETE_FAILURE,
        res.DELETE_SUCCESS,
        res.LIST,
        res.LIST_CANCEL,
        res.LIST_FAILURE,
        res.LIST_SUCCESS,
        res.READ,
        res.READ_CANCEL,
        res.READ_FAILURE,
        res.READ_SUCCESS,
        res.RESET,
        res.UPDATE,
        res.UPDATE_CANCEL,
        res.UPDATE_FAILURE,
        res.UPDATE_SUCCESS,
    ];

    return { ...res, all };
}
