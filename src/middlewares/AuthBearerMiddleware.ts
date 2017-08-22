import { select } from 'redux-saga/effects';
import { IMiddleware } from '../utils';

export function AuthBearerMiddleware(selector: () => string): IMiddleware<any> {
    return function* internal({ request }: any, next: any) {
        const token = yield select(selector);
        if (token) {
            request.headers.authorization = `Bearer ${token}`;
        }
        yield* next();
    };
}
