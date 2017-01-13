import { internal } from '../internal';

export default function actions(name) {
    return {
        CREATE: internal(`CREATE_${name.toUpperCase()}`),
        CREATE_CANCEL: internal(`CREATE_${name.toUpperCase()}_CANCEL`),
        CREATE_SUCCESS: internal(`CREATE_${name.toUpperCase()}_SUCCESS`),
        CREATE_FAILURE: internal(`CREATE_${name.toUpperCase()}_FAILURE`),

        READ: internal(`READ_${name.toUpperCase()}`),
        READ_CANCEL: internal(`READ_${name.toUpperCase()}_CANCEL`),
        READ_SUCCESS: internal(`READ_${name.toUpperCase()}_SUCCESS`),
        READ_FAILURE: internal(`READ_${name.toUpperCase()}_FAILURE`),

        UPDATE: internal(`UPDATE_${name.toUpperCase()}`),
        UPDATE_CANCEL: internal(`UPDATE_${name.toUpperCase()}_CANCEL`),
        UPDATE_SUCCESS: internal(`UPDATE_${name.toUpperCase()}_SUCCESS`),
        UPDATE_FAILURE: internal(`UPDATE_${name.toUpperCase()}_FAILURE`),

        DELETE: internal(`DELETE_${name.toUpperCase()}`),
        DELETE_CANCEL: internal(`DELETE_${name.toUpperCase()}_CANCEL`),
        DELETE_SUCCESS: internal(`DELETE_${name.toUpperCase()}_SUCCESS`),
        DELETE_FAILURE: internal(`DELETE_${name.toUpperCase()}_FAILURE`),

        LIST: internal(`LIST_${name.toUpperCase()}`),
        LIST_CANCEL: internal(`LIST_${name.toUpperCase()}_CANCEL`),
        LIST_SUCCESS: internal(`LIST_${name.toUpperCase()}_SUCCESS`),
        LIST_FAILURE: internal(`LIST_${name.toUpperCase()}_FAILURE`),

        RESET: internal(`RESET_${name.toUpperCase()}`)
    }
}
