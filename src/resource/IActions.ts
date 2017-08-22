export interface IActions {
  CREATE: string;
  CREATE_CANCEL: string;
  CREATE_SUCCESS: string;
  CREATE_FAILURE: string;

  READ: string;
  READ_CANCEL: string;
  READ_SUCCESS: string;
  READ_FAILURE: string;

  UPDATE: string;
  UPDATE_CANCEL: string;
  UPDATE_SUCCESS: string;
  UPDATE_FAILURE: string;

  DELETE: string;
  DELETE_CANCEL: string;
  DELETE_SUCCESS: string;
  DELETE_FAILURE: string;

  LIST: string;
  LIST_CANCEL: string;
  LIST_SUCCESS: string;
  LIST_FAILURE: string;

  RESET: string;

  all: string[];
}
