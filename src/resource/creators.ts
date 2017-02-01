export default function creators<T>(name, actions) {
    return {
        doCreate: (item: T) => ({ type: actions.CREATE, payload: { item } }),
        doCreateCancel: (item: T) => ({ type: actions.CREATE_CANCEL, payload: { item } }),
        doCreateSuccess: (item: T) => ({ type: actions.CREATE_SUCCESS, payload: { item } }),
        doCreateFailure: (item: T, reason) => ({ type: actions.CREATE_FAILURE, payload: { item, reason } }),

        doRead: (item: T) => ({ type: actions.READ, payload: { item } }),
        doReadCancel: (item: T) => ({ type: actions.READ_CANCEL, payload: { item } }),
        doReadSuccess: (item: T) => ({ type: actions.READ_SUCCESS, payload: { item } }),
        doReadFailure: (item: T, reason) => ({ type: actions.READ_FAILURE, payload: { item, reason } }),

        doUpdate: (item: T) => ({ type: actions.UPDATE, payload: { item } }),
        doUpdateCancel: (item: T) => ({ type: actions.UPDATE_CANCEL, payload: { item } }),
        doUpdateSuccess: (item: T) => ({ type: actions.UPDATE_SUCCESS, payload: { item } }),
        doUpdateFailure: (item: T, reason) => ({ type: actions.UPDATE_FAILURE, payload: { item, reason } }),

        doDelete: (item: T) => ({ type: actions.DELETE, payload: { item } }),
        doDeleteCancel: (item: T) => ({ type: actions.DELETE_CANCEL, payload: { item } }),
        doDeleteSuccess: (item: T) => ({ type: actions.DELETE_SUCCESS, payload: { item } }),
        doDeleteFailure: (item: T, reason) => ({ type: actions.DELETE_FAILURE, payload: { item, reason } }),

        doList: (params) => ({ type: actions.LIST, payload: { params } }),
        doListCancel: () => ({ type: actions.LIST_CANCEL, payload: {} }),
        doListSuccess: (list: T[], params) => ({ type: actions.LIST_SUCCESS, payload: { list, params } }),
        doListFailure: (reason, params) => ({ type: actions.LIST_FAILURE, payload: { reason, params } }),

        doReset: () => ({ type: actions.RESET }),
    }
}
