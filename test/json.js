const assert = require('assert');
const co = require('co');
const createSagaMiddleware = require('redux-saga').default;
const restMiddleware = require('../node/middlewares/rest').default;
const { jsonSerializationMiddleware } = require('../node/middlewares/json');
const applyMiddlewares = require('../node/utils/applyMiddlewares').default;

function faker(items) {
  var res = {
    lastRequest: null,
    middleware: function* fakeFetch({
      request,
      response
    }, next) {
      yield* next();
      res.lastRequest = Object.assign({}, request);
      if (request.method === 'GET' && request.url === `/api/fake`) {
        response.url = request.url;
        response.statusCode = 200;
        response.headers['content-type'] = 'application/json';
        response.body = JSON.stringify(items);
      }
      if (request.method === 'GET' && request.url === `/api/fake/1`) {
        response.url = request.url;
        response.statusCode = 200;
        response.headers['content-type'] = 'application/json';
        response.body = JSON.stringify({
          id: 1,
          text: 'Item 1'
        });
      }
      if (request.method === 'POST' && request.url === `/api/fake`) {
        response.url = request.url;
        response.statusCode = 201;
        response.headers['content-type'] = 'application/json';
        response.body = JSON.stringify({
          id: 4,
          text: 'New'
        });
      }
      if (request.method === 'PUT' && request.url === `/api/fake/4`) {
        response.url = request.url;
        response.statusCode = 200;
        response.headers['content-type'] = 'application/json';
        response.body = JSON.stringify({
          id: 4,
          text: 'Updated'
        });
      }
      if (request.method === 'DELETE' && request.url === `/api/fake/4`) {
        response.url = request.url;
        response.statusCode = 200;
      }
    }
  };
  return res;
}

describe('middlewares', () => {
  describe('list', () => {
    const fakeFetch = faker([{
        id: 1,
        text: 'Item 1'
      },
      {
        id: 2,
        text: 'Item 2'
      },
      {
        id: 3,
        text: 'Item 3'
      }
    ]);
    const middleware = applyMiddlewares(restMiddleware({
      id: 'id',
      url: '/api/fake'
    }), jsonSerializationMiddleware, fakeFetch.middleware);
    it('should fake list', co.wrap(function* () {
      const context = {
        list: {}
      };
      yield* middleware(context);
      assert(context.ok, 'not ok');
      assert.equal(fakeFetch.lastRequest.url, '/api/fake');
      assert.equal(fakeFetch.lastRequest.method, 'GET');
      assert.equal(fakeFetch.lastRequest.body, undefined);
      assert.deepEqual(context.listed, [{
          id: 1,
          text: 'Item 1'
        },
        {
          id: 2,
          text: 'Item 2'
        },
        {
          id: 3,
          text: 'Item 3'
        }
      ]);
    }));
  })
  describe('create', () => {
    const fakeFetch = faker([{
        id: 1,
        text: 'Item 1'
      },
      {
        id: 2,
        text: 'Item 2'
      },
      {
        id: 3,
        text: 'Item 3'
      }
    ]);
    const middleware = applyMiddlewares(restMiddleware({
      id: 'id',
      url: '/api/fake'
    }), jsonSerializationMiddleware, fakeFetch.middleware);
    it('should fake create', co.wrap(function* () {
      const context = {
        create: {
          text: 'New'
        }
      };
      yield* middleware(context);
      assert(context.ok, 'not ok');
      assert.equal(fakeFetch.lastRequest.url, '/api/fake');
      assert.equal(fakeFetch.lastRequest.method, 'POST');
      assert.deepEqual(fakeFetch.lastRequest.body, JSON.stringify({
        text: 'New'
      }));
      assert.deepEqual(context.created, {
        id: 4,
        text: 'New'
      });
    }));
  })
  describe('read', () => {
    const fakeFetch = faker([{
        id: 1,
        text: 'Item 1'
      },
      {
        id: 2,
        text: 'Item 2'
      },
      {
        id: 3,
        text: 'Item 3'
      }
    ]);
    const middleware = applyMiddlewares(restMiddleware({
      id: 'id',
      url: '/api/fake'
    }), jsonSerializationMiddleware, fakeFetch.middleware);
    it('should fake read', co.wrap(function* () {
      const context = {
        read: {
          id: 1
        }
      };
      yield* middleware(context);
      assert(context.ok, 'not ok');
      assert.equal(fakeFetch.lastRequest.url, '/api/fake/1');
      assert.equal(fakeFetch.lastRequest.method, 'GET');
      assert.equal(fakeFetch.lastRequest.body, undefined);
      assert.deepEqual(context.readed, {
        id: 1,
        text: 'Item 1'
      });
    }));
  })
  describe('update', () => {
    const fakeFetch = faker([{
        id: 1,
        text: 'Item 1'
      },
      {
        id: 2,
        text: 'Item 2'
      },
      {
        id: 3,
        text: 'Item 3'
      }
    ]);
    const middleware = applyMiddlewares(restMiddleware({
      id: 'id',
      url: '/api/fake'
    }), jsonSerializationMiddleware, fakeFetch.middleware);
    it('should fake update', co.wrap(function* () {
      const context = {
        update: {
          id: 4,
          text: 'Updated'
        }
      };
      yield* middleware(context);
      assert(context.ok, 'not ok');
      assert.equal(fakeFetch.lastRequest.url, '/api/fake/4');
      assert.equal(fakeFetch.lastRequest.method, 'PUT');
      assert.equal(fakeFetch.lastRequest.body, JSON.stringify({
        id: 4,
        text: 'Updated'
      }));
      assert.deepEqual(context.updated, {
        id: 4,
        text: 'Updated'
      });
    }));
  })
  describe('delete', () => {
    const fakeFetch = faker([{
        id: 1,
        text: 'Item 1'
      },
      {
        id: 2,
        text: 'Item 2'
      },
      {
        id: 3,
        text: 'Item 3'
      }
    ]);
    const middleware = applyMiddlewares(restMiddleware({
      id: 'id',
      url: '/api/fake'
    }), jsonSerializationMiddleware, fakeFetch.middleware);
    it('should fake delete', co.wrap(function* () {
      const context = {
        remove: {
          id: 4,
          name: 'Test'
        }
      };
      yield* middleware(context);
      assert(context.ok, 'not ok');
      assert.equal(fakeFetch.lastRequest.url, '/api/fake/4');
      assert.equal(fakeFetch.lastRequest.method, 'DELETE');
      assert.equal(fakeFetch.lastRequest.body, undefined);
      assert.equal(context.removed, undefined);
    }));
  })
})