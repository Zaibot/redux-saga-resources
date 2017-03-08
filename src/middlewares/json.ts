/* tslint:disable */
/// <reference path="./isomorphic-fetch.d.ts" />
/* tslint:enable */

import fetch from 'isomorphic-fetch';
import { call, put, select } from 'redux-saga/effects';
import { IResourceDescriptor } from '../resource';
import applyMiddlewares, { IMiddleware } from '../utils/applyMiddlewares';

const http200 = 200;
const http201 = 201;
const http204 = 204;
const http404 = 404;

export function authBearerMiddleware(selector: () => string): IMiddleware<any> {
    return function* internal({ request }: any, next: any) {
        const token = yield select(selector);
        if (token) {
            request.headers.authorization = `Bearer ${token}`;
        }
        yield* next();
    };
}

export interface IJsonResetParams {
    list?: any;
    create?: any;
    read?: any;
    update?: any;
    remove?: any;
    request?: { method: string; url: string; params: { [key: string]: string; }; headers: { [key: string]: string; }; body: any; };
    response?: { url: string; headers: { [key: string]: string; }; statusCode: number; statusText: string; body: any; };
    ok?: boolean;
}

export function defaultJsonRestMiddleware<T>(url: string, ...middlewares: Array<IMiddleware<IJsonResetParams>>) {
    return (descriptor: IResourceDescriptor<T>) => {
        return connectMiddleware(restMiddleware({ id: descriptor.options.id, url }), ...middlewares, jsonSerializationMiddleware, fetchMiddleware);
    };
}

import { fields, stripFields } from '../resource/fields';
export function connectMiddleware<T>(...middlewares: Array<IMiddleware<any>>) {
    const middleware = applyMiddlewares(...middlewares);
    return function* ({ action, descriptor }: { action: any, descriptor: IResourceDescriptor<T> }): IterableIterator<any> {
        if (action.type === descriptor.actions.CREATE) {
            // Create
            const context: any = { create: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.creators.doCreateSuccess({ ...action.payload.item, ...context.created, [fields.id]: context.created[descriptor.options.id] }));
                } else {
                    yield put(descriptor.creators.doCreateFailure(action.payload.item, context.error));
                }
            } catch (ex) {
                yield put(descriptor.creators.doCreateFailure(action.payload.item, ex));
            }
        }
        if (action.type === descriptor.actions.READ) {
            // Read
            const context: any = { read: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.creators.doReadSuccess({
                        ...action.payload.item,
                        ...context.readed,
                    }));
                } else {
                    yield put(descriptor.creators.doReadFailure(action.payload.item, context.error));
                }
            } catch (ex) {
                yield put(descriptor.creators.doReadFailure(action.payload.item, ex));
            }
        }
        if (action.type === descriptor.actions.UPDATE) {
            // Update
            const context: any = { update: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.creators.doUpdateSuccess({
                        ...action.payload.item,
                        ...context.updated,
                    }));
                } else {
                    yield put(descriptor.creators.doUpdateFailure(action.payload.item, context.error));
                }
            } catch (ex) {
                yield put(descriptor.creators.doUpdateFailure(action.payload.item, ex));
            }
        }
        if (action.type === descriptor.actions.DELETE) {
            // Delete
            const context: any = { remove: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.creators.doDeleteSuccess({
                        ...action.payload.item,
                        ...context.deleted,
                    }));
                } else {
                    yield put(descriptor.creators.doDeleteFailure(action.payload.item, context.error));
                }
            } catch (ex) {
                yield put(descriptor.creators.doDeleteFailure(action.payload.item, ex));
            }
        }
        if (action.type === descriptor.actions.LIST) {
            // List
            const context: any = { list: action.payload.params || {} };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.creators.doListSuccess(context.listed.map((item: T) => ({
                        ...(item as any),
                        [fields.id]: item[descriptor.options.id],
                    })), action.payload.params || {}));
                } else {
                    yield put(descriptor.creators.doListFailure(context.error, action.payload.params || {}));
                }
            } catch (ex) {
                yield put(descriptor.creators.doListFailure(ex, action.payload.item));
            }
        }
    };
}

const getStatusOk = (...codes: number[]) => (code: number) => codes.indexOf(code) > -1;
export function restMiddleware(options: { url: string; id: string; }) {
    const isListOk = getStatusOk(http200);
    const isReadOk = getStatusOk(http200);
    const isCreateOk = getStatusOk(http200, http201, http204);
    const isUpdateOk = getStatusOk(http200, http204);
    const isDeleteOk = getStatusOk(http200, http204, http404);

    return function* internal(context: any, next: any) {
        const request: any = context.request = {
            body: undefined,
            headers: {},
            method: 'GET',
            params: {},
            url: `${options.url}`,
        };
        const response: any = context.response = {
            body: undefined,
            headers: {},
            statusCode: undefined,
            statusText: undefined,
            url: undefined,
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
    };
}
function* safeFetch(url: string, options: any) {
    try {
        return yield call(() => fetch(url, options)) as any;
    } catch (ex) {
        return {
            statusCode: 0,
            statusText: 'error',
        };
    }
}
function headersToObject(headers: any) {
  if (headers.get && headers.keys) {
    const keys = headers.keys();
    const res: any = {};
    for (const key of keys) {
      res[key] = headers.get(key);
    }
    return res;
  }
  return headers;
}
export function* fetchMiddleware({ request, response }: any, next: any) {
    const paramKeys = Object.keys(request.params);
    const params = paramKeys.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(request.params[key])}`).join('&');
    const baseUrl = request.url;
    const url = params ? `${baseUrl}?${params}` : baseUrl;

    const result = yield safeFetch(url, {
        body: request.body,
        credentials: request.credentials,
        headers: request.headers,
        method: request.method,
    }) as any;

    response.statusText = result.statusText;
    response.statusCode = result.status;
    response.url = result.url;
    response.headers = headersToObject(result.headers);
    try {
        response.body = yield call(() => result.json());
    } catch (ex) {
        response.bodyError = ex;
    }

    yield* next();
}

export function* jsonSerializationMiddleware({ request, response }: any, next: any) {
    request.headers.accept = 'application/json';

    if (request.body) {
        request.headers['content-type'] = 'application/json';
        request.body = JSON.stringify(request.body);
    }

    yield* next();

    if (response.statusCode === http204) {
        // No content
    } else {
        if (/^application\/json/.test(response.headers['content-type'])) {
            if (typeof response.body !== 'object' && response.body !== undefined) {
                response.body = JSON.parse(response.body);
            }
        }
    }
}
