import { makeTempKey } from '../utils/tempKey';
import { fields, stripFields } from '../resource/fields';

export default function reducer(descriptor, options) {
  const { actions } = descriptor;
  return (state = { creating: false, reading: false, updating: false, deleting: false, error: null, item: {} }, action) => {
    switch (action.type) {
      case actions.APPLY: {
        return { ...state, item: { ...state.item, ...stripFields(action.payload.item || {}) } };
      }

      case actions.CREATE: {
        return { ...state, creating: true, reading: false, updating: false, deleting: false, item: descriptor.resource.create(action.payload.item) };
      }
      case actions.CREATE_CANCEL: {
        return { ...state, creating: false, item: {} };
      }
      case actions.CREATE_CONTINUE: {
        return { ...state, creating: false, item: { ...state.item, ...action.payload.item } };
      }

      case actions.READ: {
        return { ...state, creating: false, reading: true, updating: false, deleting: false, item: action.payload.item };
      }
      case actions.READ_CANCEL: {
        return { ...state, reading: false, item: {} };
      }
      case actions.READ_CONTINUE: {
        return { ...state, reading: false, item: { ...state.item, ...action.payload.item } };
      }

      case actions.UPDATE: {
        return { ...state, creating: false, reading: false, updating: true, deleting: false, item: action.payload.item };
      }
      case actions.UPDATE_CANCEL: {
        return { ...state, updating: false, item: {} };
      }
      case actions.UPDATE_CONTINUE: {
        return { ...state, updating: false, item: { ...state.item, ...action.payload.item } };
      }

      case actions.DELETE: {
        return { ...state, creating: false, reading: false, updating: false, deleting: true, item: action.payload.item };
      }
      case actions.DELETE_CANCEL: {
        return { ...state, deleting: false, item: {} };
      }
      case actions.DELETE_CONTINUE: {
        return { ...state, deleting: false, item: { ...state.item, ...action.payload.item } };
      }

      case actions.RESET: {
        return { ...state, creating: false, reading: false, updating: false, deleting: false, error: null, item: {} };
      }
      default: {
        return state;
      }
    }
  };
}
