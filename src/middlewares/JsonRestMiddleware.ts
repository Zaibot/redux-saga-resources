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
