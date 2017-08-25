export type IMiddlewareNext<T extends object> = (param: T) => IterableIterator<any>;
export type IMiddleware<T extends object> = (param: T, next: IMiddlewareNext<T>) => IterableIterator<any>;

export function applyMiddlewares<T extends object>(...middlewares: Array<IMiddleware<T>>): IMiddleware<T> {
  type Middleware = (param: T, last: IMiddleware<T>) => IterableIterator<any>;
  const compiled = middlewares.reduceRight((next: Middleware, current: IMiddleware<T>): Middleware => {
    return function*(param, last) {
      yield* current(param, function*(additional) {
        yield* next(param, last);
      });
    };
  }, function*(param: T, last: IMiddleware<T> = noop) {
    yield* last(param, noop as any /*???*/);
  });

  return compiled;
}

function* noop<T>(param: T, next: (param: T) => IterableIterator<any>): IterableIterator<any> {
  // Nothing
}
