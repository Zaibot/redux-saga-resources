import { takeEvery } from '@zaibot/fsa-saga';
import { IFactory, isType } from '@zaibot/fsa/es5';
import { Action } from 'redux';
import { put, select } from 'redux-saga/effects';
import { IActionMiddlewareFactory, IEditorDescriptor, IEditorOptions } from '.';
import { applyMiddlewares, IMiddleware, IMiddlewareNext } from '../utils';

function interceptor<T>(descriptor: IEditorDescriptor<T>, actionType: IFactory, cb: (action: Action, item: T) => any) {
    return function*(action: Action, next: IMiddlewareNext<Action>) {
        if (isType(action.type, actionType)) {
            const item: T = yield select(descriptor.selectors.item);
            yield* cb(action, item);
        }
        yield* next(action);
    };
}

function stopMiddleware<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return function*(action: Action, next: any): IterableIterator<any> {
        // Nothing.
    };
}
function resourceCreateImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE, function*(action: Action, item: T) {
        yield put(descriptor.resource.actions.CREATE({ item }));
    });
}
function resourceCreateDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE, (action: Action, item: T) => {
        // Nothing.
    });
}
function resourceCreateContinueImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function*(action: Action, item: T) {
        yield put(descriptor.resource.actions.UPDATE({ item }));
    });
}
function resourceCreateContinueDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function*(action: Action, item: T) {
        yield put(descriptor.resource.actions.CREATE({ item }));
    });
}
function resourceRead<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.READ, function*(action: Action, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.actions.APPLY({ item: storeItem }));
    });
}
function resourceUpdate<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.UPDATE, function*(action: Action, item: T) {
        yield put(descriptor.actions.APPLY({ item }));
    });
}
function resourceUpdateContinueImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function*(action: Action, item: T) {
        yield put(descriptor.resource.actions.UPDATE({ item }));
    });
}
function resourceUpdateContinueDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function*(action: Action, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        if (storeItem && descriptor.resource.fields.hasCommited(storeItem)) {
            yield put(descriptor.resource.actions.UPDATE({ item }));
        } else {
            yield put(descriptor.resource.actions.CREATE({ item }));
        }
    });
}
function resourceDelete<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.DELETE, function*(action: Action, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.actions.APPLY({ item: storeItem }));
    });
}
function resourceDeleteContinue<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<Action> {
    return interceptor(descriptor, descriptor.actions.DELETE_CONTINUE, function*(action: Action, item: T) {
        yield put(descriptor.resource.actions.DELETE({ item }));
    });
}

export function makeEditorSaga<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions, middlewares: Array<IActionMiddlewareFactory<T>>) {
    const {
    resource,
  } = descriptor;
    const actions: IFactory[] = [
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
