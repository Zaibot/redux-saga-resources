import { IAction, isType } from '@zaibot/fsa/es5';
import { call, put } from 'redux-saga/effects';
import { IResourceDescriptor } from '../resource';
import { fields, stripFields } from '../resource';
import { applyMiddlewares, IMiddleware } from '../utils';
import { FetchMiddleware } from './FetchMiddleware';
import { JsonTransportMiddleware } from './JsonTransportMiddleware';
import { RestMiddleware } from './RestMiddleware';

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

export function JsonRestMiddleware<T>(url: string, ...middlewares: Array<IMiddleware<IJsonResetParams>>) {
    return (descriptor: IResourceDescriptor<T>) => {
        return connectMiddleware(RestMiddleware({ id: descriptor.options.id, url }), ...middlewares, JsonTransportMiddleware, FetchMiddleware);
    };
}

function connectMiddleware<T>(...middlewares: Array<IMiddleware<any>>) {
    const middleware = applyMiddlewares(...middlewares);
    return function*({ action, descriptor }: { action: IAction, descriptor: IResourceDescriptor<T> }): IterableIterator<any> {
        if (isType(action, descriptor.actions.CREATE)) {
            // Create
            const context: any = { create: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.actions.CREATE_SUCCESS({
                        item: {
                            ...(action.payload.item as {}),
                            ...context.created,
                            [fields.id]: context.created[descriptor.options.id],
                        },
                    }));
                } else {
                    yield put(descriptor.actions.CREATE_FAILURE({ item: action.payload.item, reason: context.error }));
                }
            } catch (ex) {
                yield put(descriptor.actions.CREATE_FAILURE({ item: action.payload.item, reason: ex }));
            }
        } else if (isType(action, descriptor.actions.READ)) {
            // Read
            const context: any = { read: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.actions.READ_SUCCESS({
                        item: {
                            ...(action.payload.item as {}),
                            ...context.readed,
                        },
                    }));
                } else {
                    yield put(descriptor.actions.READ_FAILURE({ item: action.payload.item, reason: context.error }));
                }
            } catch (ex) {
                yield put(descriptor.actions.READ_FAILURE({ item: action.payload.item, reason: ex }));
            }
        } else if (isType(action, descriptor.actions.UPDATE)) {
            // Update
            const context: any = { update: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.actions.UPDATE_SUCCESS({
                        item: {
                            ...(action.payload.item as {}),
                            ...context.updated,
                        },
                    }));
                } else {
                    yield put(descriptor.actions.UPDATE_FAILURE({ item: action.payload.item, reason: context.error }));
                }
            } catch (ex) {
                yield put(descriptor.actions.UPDATE_FAILURE({ item: action.payload.item, reason: ex }));
            }
        } else if (isType(action, descriptor.actions.DELETE)) {
            // Delete
            const context: any = { remove: stripFields(action.payload.item) };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.actions.DELETE_SUCCESS({
                        item: {
                            ...(action.payload.item as {}),
                            ...context.deleted,
                        },
                    }));
                } else {
                    yield put(descriptor.actions.DELETE_FAILURE({ item: action.payload.item, reason: context.error }));
                }
            } catch (ex) {
                yield put(descriptor.actions.DELETE_FAILURE({ item: action.payload.item, reason: ex }));
            }
        } else if (isType(action, descriptor.actions.LIST)) {
            // List
            const context: any = { list: action.payload.params || {} };
            try {
                yield call(middleware, context);
                if (context.ok) {
                    yield put(descriptor.actions.LIST_SUCCESS(
                        {
                            list: context.listed.map((item: T) => ({
                                ...(item as any),
                                [fields.id]: item[descriptor.options.id],
                            }) as T),
                            params: action.payload.params || {},
                        }));
                } else {
                    yield put(descriptor.actions.LIST_FAILURE({ reason: context.error, params: action.payload.params || {} }));
                }
            } catch (ex) {
                yield put(descriptor.actions.LIST_FAILURE({ reason: ex, params: action.payload.params || {} }));
            }
        }
    };
}
