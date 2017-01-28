import * as fetch from 'isomorphic-fetch';
import { call } from 'redux-saga/effects';
import applyMiddlewares from '../utils/applyMiddlewares';


const w = fetchMiddleware({id:'id'}, jsonMiddleware());

w({
  update: { id: 123, name: 'Test' }
});

function fetchMiddleware(options, ...middlewares) {
  function* setupMiddleware({ create, read, update, remove }, next) {
      if (create) {
        yield* next({
          request: {
            method: 'PUT',
            headers: {
            },
            params: {
            },
            body: create
          }
        });
      } else if (read) {
        yield* next({
          request: {
            method: 'GET',
            headers: {
            },
            params: {
            }
          }
        });
      } else if (update) {
        yield* next({
          request: {
            method: 'POST',
            headers: {
            },
            params: {
              id: update[options.id]
            },
            body: update
          }
        });
      } else if (remove) {
        yield* next({
          request: {
            method: 'DELETE',
            headers: {
            },
            params: {
              id: remove[options.id]
            }
          }
        });
      } else {
        throw new Error('Expecting create, read, update or remove');
      }

  }

  function* actualFetchMiddleware({ request, create, update, remove }, next) {
    if (request.abort) {
      return;
    }

    const result = yield call(fetch(request.url, {
      method: request.method,
      headers: request.headers
    }));

    yield* next({
      response: {
        statusCode: result.statusCode,
        headers: result.headers,
        body: result.body
      }
    })
  }

  return applyMiddlewares(setupMiddleware, ...middlewares, actualFetchMiddleware);
}

function jsonMiddleware() {
  function* serializeMiddleware({ request, response }, next) {
    yield* next();

    if (!request.body) {
      return;
    }

    request.headers = {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
    request.body = JSON.stringify(request.body);

    yield* next();

    if (!/^application\/json/.test(response.headers['content-type'])) {
      return;
    }

    response.body = JSON.parse(response.body);

  }
}
