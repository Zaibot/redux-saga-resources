import { internal } from '../utils';

export function makeEditorActions(name: string) {
    return {
        APPLY: internal(`EDITOR/APPLY_${name.toUpperCase()}`),

        CREATE: internal(`EDITOR/CREATE_${name.toUpperCase()}`),
        CREATE_CANCEL: internal(`EDITOR/CREATE_${name.toUpperCase()}_CANCEL`),
        CREATE_CONTINUE: internal(`EDITOR/CREATE_${name.toUpperCase()}_CONTINUE`),

        DELETE: internal(`EDITOR/DELETE_${name.toUpperCase()}`),
        DELETE_CANCEL: internal(`EDITOR/DELETE_${name.toUpperCase()}_CANCEL`),
        DELETE_CONTINUE: internal(`EDITOR/DELETE_${name.toUpperCase()}_CONTINUE`),

        READ: internal(`EDITOR/READ_${name.toUpperCase()}`),
        READ_CANCEL: internal(`EDITOR/READ_${name.toUpperCase()}_CANCEL`),
        READ_CONTINUE: internal(`EDITOR/READ_${name.toUpperCase()}_SUCCESS`),

        RESET: internal(`EDITOR/RESET_${name.toUpperCase()}`),

        UPDATE: internal(`EDITOR/UPDATE_${name.toUpperCase()}`),
        UPDATE_CANCEL: internal(`EDITOR/UPDATE_${name.toUpperCase()}_CANCEL`),
        UPDATE_CONTINUE: internal(`EDITOR/UPDATE_${name.toUpperCase()}_CONTINUE`),

        all: [
            internal(`EDITOR/APPLY_${name.toUpperCase()}`),

            internal(`EDITOR/CREATE_${name.toUpperCase()}`),
            internal(`EDITOR/CREATE_${name.toUpperCase()}_CANCEL`),
            internal(`EDITOR/CREATE_${name.toUpperCase()}_CONTINUE`),

            internal(`EDITOR/READ_${name.toUpperCase()}`),
            internal(`EDITOR/READ_${name.toUpperCase()}_CANCEL`),
            internal(`EDITOR/READ_${name.toUpperCase()}_SUCCESS`),

            internal(`EDITOR/UPDATE_${name.toUpperCase()}`),
            internal(`EDITOR/UPDATE_${name.toUpperCase()}_CANCEL`),
            internal(`EDITOR/UPDATE_${name.toUpperCase()}_CONTINUE`),

            internal(`EDITOR/DELETE_${name.toUpperCase()}`),
            internal(`EDITOR/DELETE_${name.toUpperCase()}_CANCEL`),
            internal(`EDITOR/DELETE_${name.toUpperCase()}_CONTINUE`),

            internal(`EDITOR/RESET_${name.toUpperCase()}`),
        ],
    };
}
