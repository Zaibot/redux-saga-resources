export default function creators(name, actions) {
    return {
        doEdit: (item) => ({ type: actions.EDIT, payload: { item } }),
        doSelect: (item) => ({ type: actions.SELECT, payload: { item } }),

        doCreate: (item) => ({ type: actions.CREATE, payload: { item } }),
        doCreateCancel: (item) => ({ type: actions.CREATE_CANCEL, payload: { item } }),
        doCreateSuccess: (item) => ({ type: actions.CREATE_SUCCESS, payload: { item } }),
        doCreateFailure: (item, reason) => ({ type: actions.CREATE_FAILURE, payload: { item, reason } }),

        doRead: (item) => ({ type: actions.READ, payload: { item } }),
        doReadCancel: (item) => ({ type: actions.READ_CANCEL, payload: { item } }),
        doReadSuccess: (item) => ({ type: actions.READ_SUCCESS, payload: { item } }),
        doReadFailure: (item, reason) => ({ type: actions.READ_FAILURE, payload: { item, reason } }),

        doUpdate: (item) => ({ type: actions.UPDATE, payload: { item } }),
        doUpdateCancel: (item) => ({ type: actions.UPDATE_CANCEL, payload: { item } }),
        doUpdateSuccess: (item) => ({ type: actions.UPDATE_SUCCESS, payload: { item } }),
        doUpdateFailure: (item, reason) => ({ type: actions.UPDATE_FAILURE, payload: { item, reason } }),

        doDelete: (item) => ({ type: actions.DELETE, payload: { item } }),
        doDeleteCancel: (item) => ({ type: actions.DELETE_CANCEL, payload: { item } }),
        doDeleteSuccess: (item) => ({ type: actions.DELETE_SUCCESS, payload: { item } }),
        doDeleteFailure: (item, reason) => ({ type: actions.DELETE_FAILURE, payload: { item, reason } }),

        doReset: () => ({ type: actions.RESET }),
    }
}
