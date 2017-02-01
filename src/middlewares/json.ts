import * as fetch from 'isomorphic-fetch';
import { call, select, put } from 'redux-saga/effects';
import applyMiddlewares from '../utils/applyMiddlewares';


export function authBearerMiddleware(selector) {
    return function* internal({ request }, next) {
        const token = yield select(selector);
        if (token) {
            request.headers['authorization'] = `Bearer ${token}`;
        }
        yield* next();
    }
}

export function defaultJsonRestMiddleware<T>(url, ...middlewares) {
    return (descriptor) => {
        return connectMiddleware(descriptor, restMiddleware({ id: descriptor.options.id, url: url }), ...middlewares, jsonSerializationMiddleware, fetchMiddleware);
    };
}

import { fields, stripFields } from '../resource/fields';
import { IResourceDescriptor } from '../resource';
export function connectMiddleware<T>(descriptor, ...middlewares) {
    const middleware = applyMiddlewares(...middlewares);

    const loadin = (item) => item ? ({ ...item, [fields.id]: item[descriptor.options.id] }) : item;

    return function* ({ action, descriptor }: { action: any, descriptor: IResourceDescriptor<any> }): IterableIterator<any> {
        if (action.type === descriptor.actions.CREATE) {
            const context: any = { create: stripFields(action.payload.item) };
            yield call(middleware, context);
            if (context.ok) {
                yield put(descriptor.creators.doCreateSuccess({
                    ...action.payload.item,
                    ...context.created,
                    [fields.id]: context.created[descriptor.options.id]
                }));
            } else {
                yield put(descriptor.creators.doCreateFailure(action.payload.item, context.error));
            }
        }
        if (action.type === descriptor.actions.READ) {
            const context: any = { read: stripFields(action.payload.item) };
            yield call(middleware, context);
            if (context.ok) {
                yield put(descriptor.creators.doReadSuccess({
                    ...action.payload.item,
                    ...context.readed
                }));
            } else {
                yield put(descriptor.creators.doReadFailure(action.payload.item, context.error));
            }
        }
        if (action.type === descriptor.actions.UPDATE) {
            const context: any = { update: stripFields(action.payload.item) };
            yield call(middleware, context);
            if (context.ok) {
                yield put(descriptor.creators.doUpdateSuccess({
                    ...action.payload.item,
                    ...context.updated
                }));
            } else {
                yield put(descriptor.creators.doUpdateFailure(action.payload.item, context.error));
            }
        }
        if (action.type === descriptor.actions.DELETE) {
            const context: any = { remove: stripFields(action.payload.item) };
            yield call(middleware, context);
            if (context.ok) {
                yield put(descriptor.creators.doDeleteSuccess({
                    ...action.payload.item,
                    ...context.deleted
                }));
            } else {
                yield put(descriptor.creators.doDeleteFailure(action.payload.item, context.error));
            }
        }
        if (action.type === descriptor.actions.LIST) {
            const context: any = { list: action.payload.params || {} };
            yield call(middleware, context);
            if (context.ok) {
                yield put(descriptor.creators.doListSuccess(context.listed.map(item => ({
                    ...item,
                    [fields.id]: item[descriptor.options.id]
                })), action.payload.params || {}));
            } else {
                yield put(descriptor.creators.doListFailure(context.error, action.payload.params || {}));
            }
        }
    };
}

const getStatusOk = (...codes) => (code) => codes.indexOf(code) > -1;
export function restMiddleware(options) {
    const isListOk = getStatusOk(200);
    const isReadOk = getStatusOk(200);
    const isCreateOk = getStatusOk(200, 201);
    const isUpdateOk = getStatusOk(200);
    const isDeleteOk = getStatusOk(200, 404);

    return function* internal(context, next) {
        const request = context.request = {
            method: 'GET',
            headers: {},
            params: {},
            url: `${options.url}`,
            body: undefined
        };
        const response = context.response = {
            statusCode: undefined,
            statusText: undefined,
            headers: {},
            url: undefined,
            body: undefined
        };

        const { list, create, read, update, remove } = context;
        if (list) {
            // List
            request.method = 'GET';
            request.url = `${options.url}`;
            request.params = list;
            yield* next();
            context.ok = isListOk(response.statusCode);
            context.listed = response.body;
        } else if (read) {
            // Read
            request.method = 'GET';
            request.url = `${options.url}/${read[options.id]}`;
            yield* next();
            context.ok = isReadOk(response.statusCode);
            context.readed = response.body;
        } else if (create) {
            // Create
            request.method = 'POST';
            request.url = `${options.url}`;
            request.body = create;
            yield* next();
            context.ok = isCreateOk(response.statusCode);
            context.created = response.body;
        } else if (update) {
            // Update
            request.method = 'PUT';
            request.url = `${options.url}/${update[options.id]}`;
            request.body = update;
            yield* next();
            context.ok = isUpdateOk(response.statusCode);
            context.updated = response.body;
        } else if (remove) {
            // Remove
            request.method = 'DELETE';
            request.url = `${options.url}/${remove[options.id]}`;
            yield* next();
            context.ok = isDeleteOk(response.statusCode);
            context.removed = response.body;
        } else {
            throw new Error('Expecting list, create, read, update or remove');
        }
    }
}
export function* fetchMiddleware({ request, response, withResponse }, next) {
    yield* next();

    const paramKeys = Object.keys(request.params);
    const params = paramKeys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(request.params[key])}`).join('&');
    const baseUrl = request.url;
    const url = params ? `${baseUrl}?${params}` : baseUrl;

    const result = yield call(() => fetch(url, {
        method: request.method,
        headers: request.headers,
        credentials: request.credentials,
        body: request.body
    })) as any;

    response.statusText = result.statusText;
    response.statusCode = result.status;
    response.url = result.url;
    response.headers = result.headers;
    response.body = yield call(() => result.json());
}

export function* jsonSerializationMiddleware({ request, response }, next) {
  request.headers['accept'] = 'application/json';

    if (request.body) {
        request.headers['content-type'] = 'application/json'
        request.body = JSON.stringify(request.body);
    }

    yield* next();

    if (/^application\/json/.test(response.headers['content-type'])) {
        if (typeof response.body !== 'object') {
            response.body = JSON.parse(response.body);
        }
    }
}
