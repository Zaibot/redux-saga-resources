import { Action } from 'redux';
import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { IActionMiddlewareFactory, IEditorDescriptor, IEditorOptions } from '.';
import applyMiddlewares, { IMiddleware, IMiddlewareNext } from '../utils/applyMiddlewares';

function interceptor<T>(descriptor: IEditorDescriptor<T>, actionType: string, cb: (action: Action, item: T) => any) {
    return function* (action: Action, next: IMiddlewareNext<Action>) {
        if (action.type === actionType) {
            const item: T = yield select(descriptor.selectors.item);
            yield* cb(action, item);
        }
        yield* next(action);
    };
};

function stopMiddleware<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return function* (action: Action, next: any): IterableIterator<any> {
        // Nothing.
    };
}
function resourceCreateImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE, function* (action: Action, item: T) {
        yield put(descriptor.resource.creators.doCreate(item));
    });
}
function resourceCreateDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE, (action: Action, item: T) => {
        // Nothing.
    });
}
function resourceCreateContinueImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function* (action: Action, item: T) {
        yield put(descriptor.resource.creators.doUpdate(item));
    });
}
function resourceCreateContinueDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function* (action: Action, item: T) {
        yield put(descriptor.resource.creators.doCreate(item));
    });
}
function resourceRead<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.READ, function* (action: Action, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.creators.doApply(storeItem));
    });
}
function resourceUpdate<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.UPDATE, function* (action: Action, item: T) {
        yield put(descriptor.creators.doApply(item));
    });
}
function resourceUpdateContinueImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function* (action: Action, item: T) {
        yield put(descriptor.resource.creators.doUpdate(item));
    });
}
function resourceUpdateContinueDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function* (action: Action, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        if (storeItem && descriptor.resource.fields.hasCommited(storeItem)) {
            yield put(descriptor.resource.creators.doUpdate(item));
        } else {
            yield put(descriptor.resource.creators.doCreate(item));
        }
    });
}
function resourceDelete<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.DELETE, function* (action: Action, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.creators.doApply(storeItem));
    });
}
function resourceDeleteContinue<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.DELETE_CONTINUE, function* (action: Action, item: T) {
        yield put(descriptor.resource.creators.doDelete(item));
    });
}

export default function makeSaga<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions, middlewares: Array<IActionMiddlewareFactory<T>>) {
    const {
    resource,
  } = descriptor;
    const actions = [
        ...descriptor.actions.all,
        ...resource.actions.all,
    ];
    const factories: Array<IActionMiddlewareFactory<T>> = [
        ...middlewares,
        options.createImmediately ? resourceCreateImmediately : resourceCreateDelayed,
        options.createImmediately ? resourceCreateContinueImmediately : resourceCreateContinueDelayed,
        resourceRead,
        resourceUpdate,
        options.createImmediately ? resourceUpdateContinueImmediately : resourceUpdateContinueDelayed,
        resourceDelete,
        resourceDeleteContinue,
        stopMiddleware,
    ];
    const f = applyMiddlewares(...factories.map((mw) => mw(descriptor, options)));
    return function* internal(): any {
        yield takeEvery(actions, f as any);
    };
}
