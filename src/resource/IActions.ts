import { IFactory } from '@zaibot/fsa';

// tslint:disable-next-line:no-unused-variable
export interface IActions<T> {
  CREATE: IFactory<{ item: T }, never>;
  CREATE_CANCEL: IFactory<{ item: T }, never>;
  CREATE_SUCCESS: IFactory<{ item: T }, never>;
  CREATE_FAILURE: IFactory<{ item: T; reason: string; }, never>;

  READ: IFactory<{ item: T }, never>;
  READ_CANCEL: IFactory<{ item: T }, never>;
  READ_SUCCESS: IFactory<{ item: T }, never>;
  READ_FAILURE: IFactory<{ item: T; reason: string; }, never>;

  UPDATE: IFactory<{ item: T }, never>;
  UPDATE_CANCEL: IFactory<{ item: T }, never>;
  UPDATE_SUCCESS: IFactory<{ item: T }, never>;
  UPDATE_FAILURE: IFactory<{ item: T; reason: string; }, never>;

  DELETE: IFactory<{ item: T }, never>;
  DELETE_CANCEL: IFactory<{ item: T }, never>;
  DELETE_SUCCESS: IFactory<{ item: T }, never>;
  DELETE_FAILURE: IFactory<{ item: T; reason: string; }, never>;

  LIST: IFactory<{ params?: any }, never>;
  LIST_CANCEL: IFactory<{ }, never>;
  LIST_SUCCESS: IFactory<{ list: T[], params: any; }, never>;
  LIST_FAILURE: IFactory<{ params?: any; reason: string; }, never>;

  RESET: IFactory<{ }, never>;

  all: Array<IFactory<any, never>>;
}
