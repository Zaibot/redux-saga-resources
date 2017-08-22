export interface IMiddlewareNext<T extends Object> {
  (param: T): IterableIterator<any>;
}
export interface IMiddleware<T extends Object> {
  (param: T, next: IMiddlewareNext<T>): IterableIterator<any>;
}

export function applyMiddlewares<T extends Object>(...middlewares: Array<IMiddleware<T>>): IMiddleware<T> {
  const compiled = middlewares.reduceRight((next: (param: T, last: IMiddleware<T>) => IterableIterator<any>, current: IMiddleware<T>): (param: T, last: IMiddleware<T>) => IterableIterator<any> => {
    return function* (param, last) {
      yield* current(param, function* (additional) {
        yield* next(param, last);
      });
    };
  }, function* (param: T, last: IMiddleware<T> = noop) {
    yield* last(param, noop as any /*???*/);
  });

  return compiled;
}

function* noop<T>(param: T, next: (param: T) => IterableIterator<any>): IterableIterator<any> {
  // Nothing
}
