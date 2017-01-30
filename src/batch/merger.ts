import 'arrayq';
import { IBatchMerger } from './interfaces';
import { copyFields } from '../resource/fields';

export class Merger<T> implements IBatchMerger<T> {
  combine(items: T[]): T {
    return items.reduce((item, cur) => !item ? cur : combineObj(item, cur), null);
  }
  merge(item: T, items: T[]): T[] {
    return items.map(x => mergeObj(item, x));
  }
}

function combineObj<T>(a, b: T) {
  const keys = Object.keys(a).qIntersect(Object.keys(b));

  const res = {} as T;
  keys.forEach(key => {
    const prop = combineProp(a, b, key);
    if (prop !== undefined) {
      res[key] = prop;
    }
  });
  return res;
}

function combineProp(a, b, key) {
  if (a[key] === b[key]) {
    return a[key];
  }
}

function mergeObj<T>(input, fallback: T) {
  const keys = Object.keys(input).concat(Object.keys(fallback)).qDistinct();

  const res = copyFields({}, fallback) as T;
  keys.forEach(key => {
    const prop = mergeProp(input, fallback, key);
    if (prop !== undefined) {
      res[key] = prop;
    }
  });
  return res;
}

function mergeProp(input, fallback, key) {
  if (input[key] === undefined) {
    return fallback[key];
  } else {
    return input[key];
  }
}
