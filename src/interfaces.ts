//
// export interface IEditorActions {
//     EDIT: string;
//     SELECT: string;
//
//     CREATE: string;
//     CREATE_CANCEL: string;
//     CREATE_SUCCESS: string;
//     CREATE_FAILURE: string;
//
//     READ: string;
//     READ_CANCEL: string;
//     READ_SUCCESS: string;
//     READ_FAILURE: string;
//
//     UPDATE: string;
//     UPDATE_CANCEL: string;
//     UPDATE_SUCCESS: string;
//     UPDATE_FAILURE: string;
//
//     DELETE: string;
//     DELETE_CANCEL: string;
//     DELETE_SUCCESS: string;
//     DELETE_FAILURE: string;
//
//     RESET: string;
// }
//
// export interface IEditorCreators {
//     doEdit(item): any;
//     doSelect(item): any;
//
//     doCreate(item): any;
//     doCreateCancel(item): any;
//     doCreateSuccess(item): any;
//     doCreateFailure(item, reason): any;
//
//     doRead(item): any;
//     doReadCancel(item): any;
//     doReadSuccess(item): any;
//     doReadFailure(item, reason): any;
//
//     doUpdate(item): any;
//     doUpdateCancel(item): any;
//     doUpdateSuccess(item): any;
//     doUpdateFailure(item, reason): any;
//
//     doDelete(item): any;
//     doDeleteCancel(item): any;
//     doDeleteSuccess(item): any;
//     doDeleteFailure(item, reason): any;
//
//     doReset(): any;
// }
// 
// export interface IMiddlewareFactory {
//     (resource: IResourceDescriptor): IMiddleware;
// }
// export interface IMiddleware {
//     (action, next: (action?) => any);
// }
//
// export interface IResourceOptions {
//     id?: string;
// }
