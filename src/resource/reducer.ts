import { makeTempKey } from '../utils/tempKey';
import { fields, stripFields } from './fields';
import { listAddOrUpdate, listRemove } from '../utils/list';

const requireId = (item) => {
  if (!item) {
    throw new Error(`Expecting item.`);
  }
  const { [fields.id]: id } = item;
  if (!id) {
    throw new Error(`Expecting id to be filled, use resource.create({ ... }) to create a new instance.`);
  }
  return id;
};
const requireTempId = (item) => {
  if (!item) {
    throw new Error(`Expecting item.`);
  }
  const { [fields.tempId]: tempId } = item;
  if (!tempId) {
    throw new Error(`Expecting tempId to be filled, use resource.create({ ... }) to create a new instance.`);
  }
  return tempId;
};

export default function reducer(descriptor) {
    const { actions } = descriptor;
    return (state = { loading: false, error: null, list: [] }, action) => {
        switch (action.type) {
            case actions.CREATE: {
                // CREATE
                const internalId = requireTempId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            ...action.payload.item,
                            [fields.error]: null,
                            [fields.isModified]: true,
                            [fields.isCreating]: true
                        }
                    })
                };
            }
            case actions.CREATE_SUCCESS: {
                // CREATE - SUCCESS
                const internalId = requireTempId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            ...action.payload.item,
                            [fields.error]: null,
                            [fields.isModified]: false,
                            [fields.isCreating]: false,
                            [fields.isCreated]: true
                        }
                    })
                };
            }
            case actions.CREATE_FAILURE: {
                // CREATE - SUCCESS
                const internalId = requireTempId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            ...action.payload.item,
                            [fields.error]: action.payload.reason,
                            [fields.isCreating]: false
                        }
                    })
                };
            }
            case actions.READ: {
                // READ
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            ...action.payload.item,
                            [fields.error]: null,
                            [fields.isReading]: false
                        }
                    })
                };
            }
            case actions.UPDATE: {
                // UPDATE
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            ...action.payload.item,
                            [fields.error]: null,
                            [fields.isModified]: true,
                            [fields.isUpdating]: true
                        }
                    })
                };
            }
            case actions.UPDATE_CANCEL: {
                // UPDATE - CANCEL
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            [fields.error]: null,
                            [fields.isUpdating]: false
                        }
                    })
                };
            }
            case actions.UPDATE_SUCCESS: {
                // UPDATE - SUCCESS
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            ...action.payload.item,
                            [fields.error]: null,
                            [fields.isModified]: false,
                            [fields.isUpdating]: false,
                            [fields.isUpdated]: true
                        }
                    })
                };
            }
            case actions.UPDATE_FAILURE: {
                // UPDATE - FAILURE
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            [fields.error]: action.payload.reason,
                            [fields.isUpdating]: false
                        }
                    })
                };
            }
            case actions.DELETE: {
                // DELETE
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            [fields.error]: null,
                            [fields.isModified]: true,
                            [fields.isRemoving]: true
                        }
                    })
                };
            }
            case actions.DELETE_CANCEL: {
                // DELETE - CANCEL
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            [fields.error]: null,
                            [fields.isRemoving]: false
                        }
                    })
                };
            }
            case actions.DELETE_SUCCESS: {
                // DELETE - SUCCESS
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listRemove(descriptor, state.list, action.payload.item)
                };
            }
            case actions.DELETE_FAILURE: {
                // DELETE - FAILURE
                const internalId = requireId(action.payload.item);
                return {
                    ...state,
                    list: listAddOrUpdate(descriptor, state.list, action.payload.item, (item) => {
                        return {
                            ...item,
                            [fields.error]: action.payload.reason,
                            [fields.isRemoving]: false
                        }
                    })
                };
            }
            case actions.LIST: {
                // LIST
                return { ...state, loading: true };
            }
            case actions.LIST_CANCEL: {
                // LIST - SUCCESS
                return { ...state, loading: false, error: null };
            }
            case actions.LIST_SUCCESS: {
                // LIST - SUCCESS
                return { ...state, loading: false, error: null, list: action.payload.list.map((item) => {
                    return {
                        ...item,
                        ...action.payload.item,
                        [fields.isRead]: true
                    }
                }), params: action.payload.params };
            }
            case actions.LIST_FAILURE: {
                // LIST - FAILURE
                return { ...state, loading: false, error: action.payload.reason };
            }
            case actions.RESET: {
                // RESET
                return { ...state, loading: false, error: null, list: [], params: {} };
            }
            default: {
                // Nothing.
                return state;
            }
        }
    };
}
