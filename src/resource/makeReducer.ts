import { IAction, isType } from '@zaibot/fsa/es5';
import { IResourceDescriptor } from '.';
import { listAddOrUpdate, listRemove } from '../utils';
import { fields } from './fields';

const requireId = <T>(item: T) => {
    if (!item) {
        throw new Error(`Expecting item.`);
    }
    const { [fields.id]: id } = item;
    if (!id) {
        throw new Error(`Expecting id to be filled, use resource.create({ ... }) to create a new instance.`);
    }
    return id;
};

const requireTempId = <T>(item: T) => {
    if (!item) {
        throw new Error(`Expecting item.`);
    }
    const { [fields.tempId]: tempId } = item;
    if (!tempId) {
        throw new Error(`Expecting tempId to be filled, use resource.create({ ... }) to create a new instance.`);
    }
    return tempId;
};

export interface IState<T> {
    readonly error: Error;
    readonly list: T[];
    readonly loading: false | { time: number };
    readonly params: any;
}

export function makeReducer<T>(descriptor: IResourceDescriptor<T>) {
    const emptyState: IState<T> = {
        error: null,
        list: [],
        loading: false,
        params: null,
    };

    const { actions } = descriptor;
    return (state = emptyState, action: IAction): IState<T> => {
        if (isType(action, actions.CREATE)) {
            // CREATE
            requireTempId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...(action.payload.item as {}),
                        [fields.error]: null,
                        [fields.isModified]: { time: Date.now() },
                        [fields.isCreating]: { time: Date.now() },
                    };
                }),
            };
        } else if (isType(action, actions.CREATE_SUCCESS)) {
            // CREATE - SUCCESS
            requireTempId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...(action.payload.item as {}),
                        [fields.error]: null,
                        [fields.isModified]: false,
                        [fields.isCreating]: false,
                        [fields.isCreated]: { time: Date.now() },
                    };
                }),
            };
        } else if (isType(action, actions.CREATE_FAILURE)) {
            // CREATE - SUCCESS
            requireTempId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...(action.payload.item as {}),
                        [fields.error]: action.payload.reason,
                        [fields.isCreating]: false,
                    };
                }),
            };
        } else if (isType(action, actions.READ)) {
            // READ
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...(action.payload.item as {}),
                        [fields.error]: null,
                        [fields.isReading]: false,
                    };
                }),
            };
        } else if (isType(action, actions.UPDATE)) {
            // UPDATE
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...(action.payload.item as {}),
                        [fields.error]: null,
                        [fields.isModified]: { time: Date.now() },
                        [fields.isUpdating]: { time: Date.now() },
                    };
                }),
            };
        } else if (isType(action, actions.UPDATE_CANCEL)) {
            // UPDATE - CANCEL
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        [fields.error]: null,
                        [fields.isUpdating]: false,
                    };
                }),
            };
        } else if (isType(action, actions.UPDATE_SUCCESS)) {
            // UPDATE - SUCCESS
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...(action.payload.item as {}),
                        [fields.error]: null,
                        [fields.isModified]: false,
                        [fields.isUpdating]: false,
                        [fields.isUpdated]: { time: Date.now() },
                    };
                }),
            };
        } else if (isType(action, actions.UPDATE_FAILURE)) {
            // UPDATE - FAILURE
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        [fields.error]: action.payload.reason,
                        [fields.isUpdating]: false,
                    };
                }),
            };
        } else if (isType(action, actions.DELETE)) {
            // DELETE
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        [fields.error]: null,
                        [fields.isModified]: { time: Date.now() },
                        [fields.isRemoving]: { time: Date.now() },
                    };
                }),
            };
        } else if (isType(action, actions.DELETE_CANCEL)) {
            // DELETE - CANCEL
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        [fields.error]: null,
                        [fields.isRemoving]: false,
                    };
                }),
            };
        } else if (isType(action, actions.DELETE_SUCCESS)) {
            // DELETE - SUCCESS
            requireId(action.payload.item);
            return {
                ...state,
                list: listRemove(descriptor, state.list, action.payload.item),
            };
        } else if (isType(action, actions.DELETE_FAILURE)) {
            // DELETE - FAILURE
            requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        [fields.error]: action.payload.reason,
                        [fields.isRemoving]: false,
                    };
                }),
            };
        } else if (isType(action, actions.LIST)) {
            // LIST
            return { ...state, loading: { time: Date.now() } };
        } else if (isType(action, actions.LIST_CANCEL)) {
            // LIST - CANCEL
            return { ...state, loading: false, error: null };
        } else if (isType(action, actions.LIST_SUCCESS)) {
            // LIST - SUCCESS
            return {
                ...state,
                error: null,
                list: action.payload.list.map((item: T) => {
                    return {
                        ...(item as any),
                        [fields.isRead]: true,
                    };
                }),
                loading: false,
                params: action.payload.params,
            };
        } else if (isType(action, actions.LIST_FAILURE)) {
            // LIST - FAILURE
            return { ...state, loading: false, error: Error(action.payload.reason) };
        } else if (isType(action, actions.RESET)) {
            // RESET
            return { ...state, loading: false, error: null, list: [], params: {} };
        }
        return state;
    };
}
