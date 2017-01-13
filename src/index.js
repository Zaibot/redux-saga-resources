import {
  Effect,
  CallEffect
} from 'redux-saga/effects';
import {
  call,
  fork,
  put,
  take,
  race,
  takeEvery
} from 'redux-saga/effects';
import {
  delay
} from 'redux-saga';

import {
  fields,
  stripFields,
  selectors as fieldSelectors
} from './fields';
import {
  internal,
  isInternal
} from './internal';
import {
  makeTempKey,
  isTempKey
} from './tempKey';

import makeActions from './factories/actions';
import makeCreators from './factories/creators';
import makeDataSelectors from './factories/dataSelectors';
import makeReducer from './factories/reducer';
import makeSaga from './factories/saga';
import makeSelectors from './factories/selectors';

export {
  httpMiddleware
}
from './middlewares/http';

export function createResource(name, options, ...middlewares) {
  options = {
    id: 'id',
    ...options
  }

  const descriptor = {
    name: name,
    data: makeDataSelectors(options),
    options: options,
    actions: makeActions(name),
    creators: makeCreators(name, makeActions(name)),
    selectors: makeSelectors(name, options, entityHasSameId(options)),
    fields: fieldSelectors,
    hasSameId: entityHasSameId(options)
  };

  return {
    ...descriptor,
    create: (props) => ({ ...props,
      [fields.tempId]: makeTempKey()
    }),
    reducer: makeReducer(descriptor),
    saga: makeSaga(descriptor, ...middlewares.map(f => f(descriptor)))
  }
}

import makeEditorActions from './editor/actions';
import makeEditorCreators from './editor/creators';
import makeEditorSelectors from './editor/selectors';
import makeEditorReducer from './editor/reducer';
import makeEditorSaga from './editor/saga';
export function createEditor(name, options, resource, ...middlewares) {
  options = {
    id: 'id',
    ...options
  }

  const descriptor = {
    resource: resource,
    name: name,
    options: options,
    actions: makeEditorActions(name),
    creators: makeEditorCreators(name, makeEditorActions(name)),
    selectors: makeEditorSelectors(name, options, resource),
  };

  return {
    ...descriptor,
    reducer: makeEditorReducer(descriptor),
    saga: makeEditorSaga(descriptor, ...middlewares.map(f => f(descriptor)))
  }
}

function entityHasSameId(options) {
  const { id: internalId, tempId } = fields;
  const { id } = options;
  var leftId, rightId;

  return (left, right) => {
    if (left === right) return true;
    if (left && right) {
      // Internal ID
      leftId = left[internalId];
      rightId = right[internalId];
      if (leftId && (leftId === rightId)) return true;

      // Object ID
      if (id) {
        leftId = left[id];
        rightId = right[id];
        if (leftId && (leftId === rightId)) return true;
      }

      // Temporary ID
      leftId = left[tempId];
      rightId = right[tempId];
      if (leftId && (leftId === rightId)) return true;
    }
    return false;
  };
}