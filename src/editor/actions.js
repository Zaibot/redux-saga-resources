import { internal } from '../internal';

export default function actions(name) {
    return {
        EDIT: internal(`EDIT/EDIT_${name.toUpperCase()}`),
        SELECT: internal(`EDIT/SELECT_${name.toUpperCase()}`),

        CREATE: internal(`EDIT/CREATE_${name.toUpperCase()}`),
        CREATE_CANCEL: internal(`EDIT/CREATE_${name.toUpperCase()}_CANCEL`),
        CREATE_SUCCESS: internal(`EDIT/CREATE_${name.toUpperCase()}_SUCCESS`),
        CREATE_FAILURE: internal(`EDIT/CREATE_${name.toUpperCase()}_FAILURE`),

        READ: internal(`EDIT/READ_${name.toUpperCase()}`),
        READ_CANCEL: internal(`EDIT/READ_${name.toUpperCase()}_CANCEL`),
        READ_SUCCESS: internal(`EDIT/READ_${name.toUpperCase()}_SUCCESS`),
        READ_FAILURE: internal(`EDIT/READ_${name.toUpperCase()}_FAILURE`),

        UPDATE: internal(`EDIT/UPDATE_${name.toUpperCase()}`),
        UPDATE_CANCEL: internal(`EDIT/UPDATE_${name.toUpperCase()}_CANCEL`),
        UPDATE_SUCCESS: internal(`EDIT/UPDATE_${name.toUpperCase()}_SUCCESS`),
        UPDATE_FAILURE: internal(`EDIT/UPDATE_${name.toUpperCase()}_FAILURE`),

        DELETE: internal(`EDIT/DELETE_${name.toUpperCase()}`),
        DELETE_CANCEL: internal(`EDIT/DELETE_${name.toUpperCase()}_CANCEL`),
        DELETE_SUCCESS: internal(`EDIT/DELETE_${name.toUpperCase()}_SUCCESS`),
        DELETE_FAILURE: internal(`EDIT/DELETE_${name.toUpperCase()}_FAILURE`),

        RESET: internal(`EDIT/RESET_${name.toUpperCase()}`)
    }
}
