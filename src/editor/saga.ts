import { takeEvery } from 'redux-saga';
import { call, take, race, put, select } from 'redux-saga/effects';
import { IEditor } from '.';

function applyMiddlewares(...middlewares) {
    return middlewares.slice(0).reverse().reduce((next, middleware) => {
        return function* (action) {
            yield* middleware(action, function* (a = action) {
                yield* next(a);
            });
        };
    }, function* (action) {
        console.error(`Reached end of middleware.`, action)
    });
}

function stopMiddleware<T>(descriptor: IEditor<T>, options) {
    return function* (action, next) {
        // Nothing.
    };
}

function interceptor<T>(descriptor: IEditor<T>, actionType, cb) {
    return function* (action, next) {
        if (action.type === actionType) {
            const item: T = yield select(descriptor.selectors.item);
            yield* cb(action, item);
        }
        yield* next(action);
    };
};
function resourceCreateImmediately<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.CREATE, function* (action, item) {
        yield put(descriptor.resource.creators.doCreate(item));
    });
}
function resourceCreateDelayed<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.CREATE, function* (action, item) {
        // Nothing.
    });
}
function resourceCreateContinueImmediately<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function* (action, item) {
        yield put(descriptor.resource.creators.doUpdate(item));
    });
}
function resourceCreateContinueDelayed<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.CREATE_CONTINUE, function* (action, item) {
        yield put(descriptor.resource.creators.doCreate(item));
    });
}
function resourceRead<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.READ, function* (action, item) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.creators.doApply(storeItem));
    });
}
function resourceUpdate<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.UPDATE, function* (action, item) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.creators.doApply(storeItem));
    });
}
function resourceUpdateContinueImmediately<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function* (action, item) {
        yield put(descriptor.resource.creators.doUpdate(item));
    });
}
function resourceUpdateContinueDelayed<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.UPDATE_CONTINUE, function* (action, item) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        if (descriptor.resource.fields.hasCommited(storeItem)) {
            yield put(descriptor.resource.creators.doUpdate(item));
        } else {
            yield put(descriptor.resource.creators.doCreate(item));
        }
    });
}
function resourceDelete<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.DELETE, function* (action, item) {
        const storeItem: T = yield select(descriptor.resource.selectors.itemByItem(item));
        yield put(descriptor.creators.doApply(storeItem));
    });
}
function resourceDeleteContinue<T>(descriptor: IEditor<T>, options) {
    return interceptor(descriptor, descriptor.actions.DELETE_CONTINUE, function* (action, item) {
        yield put(descriptor.resource.creators.doDelete(item));
    });
}

export default function makeSaga(descriptor, options, ...middlewares) {
    const {
        resource
    } = descriptor;
    const actions = [
        ...descriptor.actions.all,
        ...resource.actions.all
    ];
    const f = applyMiddlewares(...middlewares.concat(
        options.createImmediately ? resourceCreateImmediately : resourceCreateDelayed,
        options.createImmediately ? resourceCreateContinueImmediately : resourceCreateContinueDelayed,
        resourceRead,
        resourceUpdate,
        options.createImmediately ? resourceUpdateContinueImmediately : resourceUpdateContinueDelayed,
        resourceDelete,
        resourceDeleteContinue,
        stopMiddleware
    ).map(mw => mw(descriptor, options)));
    return function* internal(): any {
        yield takeEvery(actions, f);
    }
}