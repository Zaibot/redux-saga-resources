import { makeTempKey } from '../tempKey';
import { fields, stripFields } from '../fields';

export default function reducer(descriptor) {
    const { actions } = descriptor;
    return (state = { opened: false, loading: false, error: null, item: {} }, action) => {
        switch (action.type) {
            case actions.EDIT: {
                return { ...state, item: { ...state.item, ...stripFields(action.payload.item || {}) } };
            }
            case actions.SELECT: {
                return { ...state, opened: true, loading: false, item: action.payload.item };
            }
            case actions.CREATE: {
                return { ...state, opened: false, loading: true, item: descriptor.resource.create({ ...action.payload.item }) };
            }
            case actions.CREATE_SUCCESS: {
                return { ...state, opened: false, loading: false, error: null, item: { ...state.item, ...action.payload.item } };
            }
            case actions.CREATE_FAILURE: {
                return { ...state, opened: true, loading: false, error: action.payload.reason, item: { ...state.item, ...action.payload.item } };
            }
            case actions.READ: {
                return { ...state, opened: true, loading: true, item: {} };
            }
            case actions.UPDATE: {
                return { ...state, opened: false, loading: true, item: { ...state.item, ...action.payload.item } };
            }
            case actions.UPDATE_CANCEL: {
                return { ...state, opened: true, loading: false, item: { ...state.item, ...action.payload.item } };
            }
            case actions.UPDATE_SUCCESS: {
                return { ...state, opened: false, loading: false, error: null, item: {} };
            }
            case actions.UPDATE_FAILURE: {
                return { ...state, opened: true, loading: false, error: action.payload.reason, item: action.payload.item };
            }
            case actions.DELETE: {
                return { ...state, opened: false, loading: true, item: { ...state.item, ...action.payload.item } };
            }
            case actions.DELETE_CANCEL: {
                return { ...state, loading: false, item: { ...state.item, ...action.payload.item } };
            }
            case actions.DELETE_SUCCESS: {
                return { ...state, opened: false, loading: false, error: null, item: {} };
            }
            case actions.DELETE_FAILURE: {
                return { ...state, loading: true, error: action.payload.reason, item: { ...state.item, ...action.payload.item } };
            }
            case actions.RESET: {
                return { ...state, opened: false, loading: false, error: null, item: {} };
            }
            default: {
                return state;
            }
        }
    };
}
