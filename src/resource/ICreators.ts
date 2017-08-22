export interface ICreators<T> {
    doCreate(item: T): any;
    doCreateCancel(item: T): any;
    doCreateSuccess(item: T): any;
    doCreateFailure(item: T, reason: string): any;
  
    doRead(item: T): any;
    doReadCancel(item: T): any;
    doReadSuccess(item: T): any;
    doReadFailure(item: T, reason: string): any;
  
    doUpdate(item: T): any;
    doUpdateCancel(item: T): any;
    doUpdateSuccess(item: T): any;
    doUpdateFailure(item: T, reason: string): any;
  
    doDelete(item: T): any;
    doDeleteCancel(item: T): any;
    doDeleteSuccess(item: T): any;
    doDeleteFailure(item: T, reason: string): any;
  
    doList(params?: any): any;
    doListCancel(): any;
    doListSuccess(list: T[], params: any): any;
    doListFailure(reason: string, params: any): any;
  
    doReset(): any;
  }
  