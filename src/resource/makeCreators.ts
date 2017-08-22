import { IActions } from '.';

export function makeCreators<T>(name: string, actions: IActions) {
  return {
    doCreate: (item: T) => ({ type: actions.CREATE, payload: { item } }),
    doCreateCancel: (item: T) => ({ type: actions.CREATE_CANCEL, payload: { item } }),
    doCreateFailure: (item: T, reason: string) => ({ type: actions.CREATE_FAILURE, payload: { item, reason } }),
    doCreateSuccess: (item: T) => ({ type: actions.CREATE_SUCCESS, payload: { item } }),

    doDelete: (item: T) => ({ type: actions.DELETE, payload: { item } }),
    doDeleteCancel: (item: T) => ({ type: actions.DELETE_CANCEL, payload: { item } }),
    doDeleteFailure: (item: T, reason: string) => ({ type: actions.DELETE_FAILURE, payload: { item, reason } }),
    doDeleteSuccess: (item: T) => ({ type: actions.DELETE_SUCCESS, payload: { item } }),

    doList: (params: any) => ({ type: actions.LIST, payload: { params } }),
    doListCancel: () => ({ type: actions.LIST_CANCEL, payload: {} }),
    doListFailure: (reason: string, params: any) => ({ type: actions.LIST_FAILURE, payload: { reason, params } }),
    doListSuccess: (list: T[], params: any) => ({ type: actions.LIST_SUCCESS, payload: { list, params } }),

    doRead: (item: T) => ({ type: actions.READ, payload: { item } }),
    doReadCancel: (item: T) => ({ type: actions.READ_CANCEL, payload: { item } }),
    doReadFailure: (item: T, reason: string) => ({ type: actions.READ_FAILURE, payload: { item, reason } }),
    doReadSuccess: (item: T) => ({ type: actions.READ_SUCCESS, payload: { item } }),

    doReset: () => ({ type: actions.RESET }),

    doUpdate: (item: T) => ({ type: actions.UPDATE, payload: { item } }),
    doUpdateCancel: (item: T) => ({ type: actions.UPDATE_CANCEL, payload: { item } }),
    doUpdateFailure: (item: T, reason: string) => ({ type: actions.UPDATE_FAILURE, payload: { item, reason } }),
    doUpdateSuccess: (item: T) => ({ type: actions.UPDATE_SUCCESS, payload: { item } }),
  };
}
