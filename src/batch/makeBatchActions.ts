import { Action } from '@zaibot/fsa';
import { internal } from '../utils';
import { IBatchActions } from './interfaces';

export function makeBatchActions<T>(name: string): IBatchActions<T> {
  const res = {
    APPLY: Action<{ item: Partial<T> }, never>(internal(`BATCH/APPLY_${name.toUpperCase()}`)),

    CREATE: Action<{ items: T[] }, never>(internal(`BATCH/CREATE_${name.toUpperCase()}`)),
    CREATE_CANCEL: Action<never, never>(internal(`BATCH/CREATE_${name.toUpperCase()}_CANCEL`)),
    CREATE_CONTINUE: Action<{ items: T[], item: T }, never>(internal(`BATCH/CREATE_${name.toUpperCase()}_CONTINUE`)),

    DELETE: Action<{ items: T[] }, never>(internal(`BATCH/DELETE_${name.toUpperCase()}`)),
    DELETE_CANCEL: Action<never, never>(internal(`BATCH/DELETE_${name.toUpperCase()}_CANCEL`)),
    DELETE_CONTINUE: Action<{ items: T[] }, never>(internal(`BATCH/DELETE_${name.toUpperCase()}_CONTINUE`)),

    READ: Action<{ items: T[] }, never>(internal(`BATCH/READ_${name.toUpperCase()}`)),
    READ_CANCEL: Action<never, never>(internal(`BATCH/READ_${name.toUpperCase()}_CANCEL`)),
    READ_CONTINUE: Action<{ items: T[], item: T }, never>(internal(`BATCH/READ_${name.toUpperCase()}_SUCCESS`)),

    RESET: Action<never, never>(internal(`BATCH/RESET_${name.toUpperCase()}`)),

    UPDATE: Action<{ items: T[] }, never>(internal(`BATCH/UPDATE_${name.toUpperCase()}`)),
    UPDATE_CANCEL: Action<never, never>(internal(`BATCH/UPDATE_${name.toUpperCase()}_CANCEL`)),
    UPDATE_CONTINUE: Action<{ items: T[], item: T }, never>(internal(`BATCH/UPDATE_${name.toUpperCase()}_CONTINUE`)),
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
