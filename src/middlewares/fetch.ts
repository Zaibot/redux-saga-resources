/* tslint:disable */
/// <reference path="./isomorphic-fetch.d.ts" />
/* tslint:enable */

import fetch from 'isomorphic-fetch';
import { call } from 'redux-saga/effects';

export default function* fetchMiddleware({ request, response }: any, next: any) {
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
