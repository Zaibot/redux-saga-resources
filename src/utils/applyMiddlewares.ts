export interface Middleware<T extends Object> {
  (param: T, next?: (param: T) => IterableIterator<any>): IterableIterator<any>;
}


export default function applyMiddlewares<T extends Object>(...middlewares: Middleware<T>[]): Middleware<T> {
  return middlewares.slice(0).reverse().reduce((next: (param: T) => IterableIterator<any>, middleware: Middleware<T>) => {
    return function* (param) {
      yield* middleware(param, function* (additional) {
        yield* next(param);
      });
    };
  }, function* (param: T, next?: Middleware<T>) {
    if (next) {
      yield* next(param);
    }
  });
}
