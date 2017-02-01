export default function creators(name, actions) {
  return {
    doApply: (item) => ({ type: actions.APPLY, payload: { item } }),

    doCreate: (item) => ({ type: actions.CREATE, payload: { item } }),
    doCreateCancel: () => ({ type: actions.CREATE_CANCEL, payload: {} }),
    doCreateContinue: (item) => ({ type: actions.CREATE_CONTINUE, payload: { item } }),

    doRead: (item) => ({ type: actions.READ, payload: { item } }),
    doReadCancel: () => ({ type: actions.READ_CANCEL, payload: {} }),
    doReadContinue: (item) => ({ type: actions.READ_CONTINUE, payload: { item } }),

    doUpdate: (item) => ({ type: actions.UPDATE, payload: { item } }),
    doUpdateCancel: () => ({ type: actions.UPDATE_CANCEL, payload: {} }),
    doUpdateContinue: (item) => ({ type: actions.UPDATE_CONTINUE, payload: { item } }),

    doDelete: (item) => ({ type: actions.DELETE, payload: { item } }),
    doDeleteCancel: () => ({ type: actions.DELETE_CANCEL, payload: {} }),
    doDeleteContinue: (item) => ({ type: actions.DELETE_CONTINUE, payload: { item } }),

    doReset: () => ({ type: actions.RESET }),
  }
}
