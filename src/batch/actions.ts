import actionCreatorFactory, { ActionCreator, EmptyActionCreator } from 'redux-typescript-actions';
import { internal } from '../utils/internal';
import { IBatchActions } from './interfaces';

const actionCreator = actionCreatorFactory();

export default function actions<T>(name: string): IBatchActions<T> {
  const res = {
    APPLY: actionCreator<{ item: T }>(internal(`BATCH/APPLY_${name.toUpperCase()}`)),

    CREATE: actionCreator<{ items: T[] }>(internal(`BATCH/CREATE_${name.toUpperCase()}`)),
    CREATE_CANCEL: actionCreator(internal(`BATCH/CREATE_${name.toUpperCase()}_CANCEL`)),
    CREATE_CONTINUE: actionCreator < { items: T[], item: T } > (internal(`BATCH/CREATE_${name.toUpperCase()}_CONTINUE`)),

    DELETE: actionCreator<{ items: T[] }>(internal(`BATCH/DELETE_${name.toUpperCase()}`)),
    DELETE_CANCEL: actionCreator(internal(`BATCH/DELETE_${name.toUpperCase()}_CANCEL`)),
    DELETE_CONTINUE: actionCreator<{ items: T[] }>(internal(`BATCH/DELETE_${name.toUpperCase()}_CONTINUE`)),

    READ: actionCreator<{ items: T[] }>(internal(`BATCH/READ_${name.toUpperCase()}`)),
    READ_CANCEL: actionCreator(internal(`BATCH/READ_${name.toUpperCase()}_CANCEL`)),
    READ_CONTINUE: actionCreator < { items: T[], item: T } > (internal(`BATCH/READ_${name.toUpperCase()}_SUCCESS`)),

    RESET: actionCreator(internal(`BATCH/RESET_${name.toUpperCase()}`)),

    UPDATE: actionCreator<{ items: T[] }>(internal(`BATCH/UPDATE_${name.toUpperCase()}`)),
    UPDATE_CANCEL: actionCreator(internal(`BATCH/UPDATE_${name.toUpperCase()}_CANCEL`)),
    UPDATE_CONTINUE: actionCreator < { items: T[], item: T } > (internal(`BATCH/UPDATE_${name.toUpperCase()}_CONTINUE`)),
  };
  const all = [
    res.APPLY,
    res.CREATE,
    res.CREATE_CANCEL,
    res.CREATE_CONTINUE,
    res.DELETE,
    res.DELETE_CANCEL,
    res.DELETE_CONTINUE,
    res.READ,
    res.READ_CANCEL,
    res.READ_CONTINUE,
    res.RESET,
    res.UPDATE,
    res.UPDATE_CANCEL,
    res.UPDATE_CONTINUE,
  ];

  return { ...res, all };
}
