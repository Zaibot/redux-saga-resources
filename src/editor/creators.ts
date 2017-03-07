import { IEditorActions } from '.';

export default function creators<T>(name: string, actions: IEditorActions) {
  return {
    doApply: (item: T) => ({ type: actions.APPLY, payload: { item } }),

    doCreate: (item: T) => ({ type: actions.CREATE, payload: { item } }),
    doCreateCancel: () => ({ type: actions.CREATE_CANCEL, payload: {} }),
    doCreateContinue: (item: T) => ({ type: actions.CREATE_CONTINUE, payload: { item } }),

    doDelete: (item: T) => ({ type: actions.DELETE, payload: { item } }),
    doDeleteCancel: () => ({ type: actions.DELETE_CANCEL, payload: {} }),
    doDeleteContinue: (item: T) => ({ type: actions.DELETE_CONTINUE, payload: { item } }),

    doRead: (item: T) => ({ type: actions.READ, payload: { item } }),
    doReadCancel: () => ({ type: actions.READ_CANCEL, payload: {} }),
    doReadContinue: (item: T) => ({ type: actions.READ_CONTINUE, payload: { item } }),

    doReset: () => ({ type: actions.RESET }),

    doUpdate: (item: T) => ({ type: actions.UPDATE, payload: { item } }),
    doUpdateCancel: () => ({ type: actions.UPDATE_CANCEL, payload: {} }),
    doUpdateContinue: (item: T) => ({ type: actions.UPDATE_CONTINUE, payload: { item } }),
  };
}
