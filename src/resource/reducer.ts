import { Action } from 'redux';
import { IResourceDescriptor } from '.';
import { listAddOrUpdate, listRemove } from '../utils/list';
import { makeTempKey } from '../utils/tempKey';
import { fields, stripFields } from './fields';
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
export default function reducer<T>(descriptor: IResourceDescriptor<T>) {
    type State = { loading: false | { time: number }, error: Error, list: T[] };
    const emptyState: State = { loading: false, error: null as Error, list: [] as T[] };
    const { actions } = descriptor;
    return (state: State = emptyState, action: Action | any): State => {
        if (action.type === actions.CREATE) {
            // CREATE
            const internalId = requireTempId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...action.payload.item,
                        [fields.error]: null,
                        [fields.isModified]: { time: Date.now() },
                        [fields.isCreating]: { time: Date.now() },
                    };
                }),
            };
        }
        if (action.type === actions.CREATE_SUCCESS) {
            // CREATE - SUCCESS
            const internalId = requireTempId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...action.payload.item,
                        [fields.error]: null,
                        [fields.isModified]: false,
                        [fields.isCreating]: false,
                        [fields.isCreated]: { time: Date.now() },
                    };
                }),
            };
        }
        if (action.type === actions.CREATE_FAILURE) {
            // CREATE - SUCCESS
            const internalId = requireTempId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...action.payload.item,
                        [fields.error]: action.payload.reason,
                        [fields.isCreating]: false,
                    };
                }),
            };
        }
        if (action.type === actions.READ) {
            // READ
            const internalId = requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...action.payload.item,
                        [fields.error]: null,
                        [fields.isReading]: false,
                    };
                }),
            };
        }
        if (action.type === actions.UPDATE) {
            // UPDATE
            const internalId = requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...action.payload.item,
                        [fields.error]: null,
                        [fields.isModified]: { time: Date.now() },
                        [fields.isUpdating]: { time: Date.now() },
                    };
                }),
            };
        }
        if (action.type === actions.UPDATE_CANCEL) {
            // UPDATE - CANCEL
            const internalId = requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        [fields.error]: null,
                        [fields.isUpdating]: false,
                    };
                }),
            };
        }
        if (action.type === actions.UPDATE_SUCCESS) {
            // UPDATE - SUCCESS
            const internalId = requireId(action.payload.item);
            return {
                ...state,
                list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item: any) => {
                    return {
                        ...item,
                        ...action.payload.item,
                        [fields.error]: null,
                        [fields.isModified]: false,
                        [fields.isUpdating]: false,
                        [fields.isUpdated]: { time: Date.now() },
                    };
                }),
            };
        }
        if (action.type === actions.UPDATE_FAILURE) {
            // UPDATE - FAILURE
            const internalId = requireId(action.payload.item);
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
        }
        if (action.type === actions.DELETE) {
            // DELETE
            const internalId = requireId(action.payload.item);
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
        }
        if (action.type === actions.DELETE_CANCEL) {
            // DELETE - CANCEL
            const internalId = requireId(action.payload.item);
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
        }
        if (action.type === actions.DELETE_SUCCESS) {
            // DELETE - SUCCESS
            const internalId = requireId(action.payload.item);
            return {
                ...state,
                list: listRemove(descriptor, state.list, action.payload.item),
            };
        }
        if (action.type === actions.DELETE_FAILURE) {
            // DELETE - FAILURE
            const internalId = requireId(action.payload.item);
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
        }
        if (action.type === actions.LIST_SUCCESS) {
            // LIST
            return { ...state, loading: { time: Date.now() } };
        }
        if (action.type === actions.LIST_CANCEL) {
            // LIST - CANCEL
            return { ...state, loading: false, error: null };
        }
        if (action.type === actions.LIST_SUCCESS) {
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
        }
        if (action.type === actions.LIST_FAILURE) {
            // LIST - FAILURE
            return { ...state, loading: false, error: action.payload.reason };
        }
        if (action.type === actions.RESET) {
            // RESET
            return { ...state, loading: false, error: null, list: [], params: {} };
        }
        return state;
    };
}
