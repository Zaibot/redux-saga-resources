import { takeEvery } from '@zaibot/fsa-saga';
import { IAction, IFactory, isType } from '@zaibot/fsa/es5';
import { put, select } from 'redux-saga/effects';
import { IActionMiddlewareFactory, IEditorDescriptor, IEditorOptions } from '.';
import { applyMiddlewares, IMiddleware, IMiddlewareNext } from '../utils';

function interceptor<T>(descriptor: IEditorDescriptor<T>, actionType: IFactory, cb: (action: IAction, item: T) => any) {
    return function*(action: IAction, next: IMiddlewareNext<IAction>) {
        if (isType(action, actionType)) {
            const item: T = yield select(descriptor.selectors.item);
            yield* cb(action, item);
        }
        yield* next(action);
    };
}

function stopMiddleware<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return function*(action: IAction, next: any): IterableIterator<any> {
        // Nothing.
    };
}
function resourceCreateImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.CREATE, function*(action: IAction, item: T) {
        yield put(descriptor.resource.actions.CREATE({ item }));
    });
}
function resourceCreateDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.CREATE, (action: IAction, item: T) => {
        // Nothing.
    });
}
function resourceCreateContinueImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function*(action: IAction, item: T) {
        yield put(descriptor.resource.actions.UPDATE({ item }));
    });
}
function resourceCreateContinueDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function*(action: IAction, item: T) {
        yield put(descriptor.resource.actions.CREATE({ item }));
    });
}
function resourceRead<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.READ, function*(action: IAction, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.actions.APPLY({ item: storeItem }));
    });
}
function resourceUpdate<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.UPDATE, function*(action: IAction, item: T) {
        yield put(descriptor.actions.APPLY({ item }));
    });
}
function resourceUpdateContinueImmediately<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function*(action: IAction, item: T) {
        yield put(descriptor.resource.actions.UPDATE({ item }));
    });
}
function resourceUpdateContinueDelayed<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function*(action: IAction, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        if (storeItem && descriptor.resource.fields.hasCommited(storeItem)) {
            yield put(descriptor.resource.actions.UPDATE({ item }));
        } else {
            yield put(descriptor.resource.actions.CREATE({ item }));
        }
    });
}
function resourceDelete<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.DELETE, function*(action: IAction, item: T) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.actions.APPLY({ item: storeItem }));
    });
}
function resourceDeleteContinue<T>(descriptor: IEditorDescriptor<T>, options: IEditorOptions): IMiddleware<IAction> {
    return interceptor(descriptor, descriptor.actions.DELETE_CONTINUE, function*(action: IAction, item: T) {
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
