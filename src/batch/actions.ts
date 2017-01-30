import { internal } from '../utils/internal';
import actionCreatorFactory, { EmptyActionCreator, ActionCreator } from 'redux-typescript-actions';

const actionCreator = actionCreatorFactory();

export default function actions(name) {
    const res = {
        APPLY: actionCreator<{ item }>(internal(`BATCH/APPLY_${name.toUpperCase()}`)),

        CREATE: actionCreator<{ items }>(internal(`BATCH/CREATE_${name.toUpperCase()}`)),
        CREATE_CANCEL: actionCreator(internal(`BATCH/CREATE_${name.toUpperCase()}_CANCEL`)),
        CREATE_CONTINUE: actionCreator<{ items, item }>(internal(`BATCH/CREATE_${name.toUpperCase()}_CONTINUE`)),

        READ: actionCreator<{ items }>(internal(`BATCH/READ_${name.toUpperCase()}`)),
        READ_CANCEL: actionCreator(internal(`BATCH/READ_${name.toUpperCase()}_CANCEL`)),
        READ_CONTINUE: actionCreator<{ items, item }>(internal(`BATCH/READ_${name.toUpperCase()}_SUCCESS`)),

        UPDATE: actionCreator<{ items }>(internal(`BATCH/UPDATE_${name.toUpperCase()}`)),
        UPDATE_CANCEL: actionCreator(internal(`BATCH/UPDATE_${name.toUpperCase()}_CANCEL`)),
        UPDATE_CONTINUE: actionCreator<{ items, item }>(internal(`BATCH/UPDATE_${name.toUpperCase()}_CONTINUE`)),

        DELETE: actionCreator<{ items }>(internal(`BATCH/DELETE_${name.toUpperCase()}`)),
        DELETE_CANCEL: actionCreator(internal(`BATCH/DELETE_${name.toUpperCase()}_CANCEL`)),
        DELETE_CONTINUE: actionCreator<{ items }>(internal(`BATCH/DELETE_${name.toUpperCase()}_CONTINUE`)),

        RESET: actionCreator(internal(`BATCH/RESET_${name.toUpperCase()}`))
    };
    const all = [
        res.APPLY,
        res.CREATE,
        res.CREATE_CANCEL,
        res.CREATE_CONTINUE,
        res.READ,
        res.READ_CANCEL,
        res.READ_CONTINUE,
        res.UPDATE,
        res.UPDATE_CANCEL,
        res.UPDATE_CONTINUE,
        res.DELETE,
        res.DELETE_CANCEL,
        res.DELETE_CONTINUE,
        res.RESET
    ];

    return { ...res, all }
}
