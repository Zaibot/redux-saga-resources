import { select } from 'redux-saga/effects';
import { IMiddleware } from '../utils/applyMiddlewares';

export default function authBearerMiddleware(selector: () => string): IMiddleware<any> {
    return function* internal({ request }: any, next: any) {
        const token = yield select(selector);
        if (token) {
            request.headers.authorization = `Bearer ${token}`;
        }
        yield* next();
    };
}
