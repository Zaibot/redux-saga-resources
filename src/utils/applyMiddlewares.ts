export interface Middleware<T extends Object> {
  (param: T, next: (param: T) => IterableIterator<any>): IterableIterator<any>;
}


export default function applyMiddlewares<T extends Object>(...middlewares: Middleware<T>[]): Middleware<T> {
  const compiled = middlewares.reduceRight((next: (param: T, last: Middleware<T>) => IterableIterator<any>, current: Middleware<T>) => {
     return function* (param, last) {
       yield* current(param, function* (additional) {
         yield* next(param, last);
       });
     };
   }, function* (param: T, last: Middleware<T> = noop) {
     yield* last(param, noop as any /*???*/);
   });

  return compiled;
}

function* noop<T>(param: T, next: (param: T) => IterableIterator<any>) {
}