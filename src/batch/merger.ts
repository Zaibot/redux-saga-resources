import 'arrayq';
import { copyFields } from '../resource/fields';
import { IBatchMerger } from './interfaces';

export class Merger<T> implements IBatchMerger<T> {
  public combine(items: T[]): T {
    return items.reduce((item, cur) => !item ? cur : combineObj(item, cur), null);
  }
  public merge(item: T, items: T[]): T[] {
    return items.map((x) => mergeObj(item, x));
  }
}

function combineObj<T>(a: any, b: T) {
  const keys = Object.keys(a).qIntersect(Object.keys(b));

  const res = {} as T;
  keys.forEach((key) => {
    const prop = combineProp(a, b, key);
    if (prop !== undefined) {
      res[key] = prop;
    }
  });
  return res;
}

function combineProp(a: any, b: any, key: string) {
  if (a[key] === b[key]) {
    return a[key];
  }
}

function mergeObj<T>(input: any, fallback: T) {
  const keys = Object.keys(input).concat(Object.keys(fallback)).qDistinct();

  const res = copyFields({}, fallback) as T;
  keys.forEach((key) => {
    const prop = mergeProp(input, fallback, key);
    if (prop !== undefined) {
      res[key] = prop;
    }
  });
  return res;
}

function mergeProp(input: any, fallback: any, key: string) {
  if (input[key] === undefined) {
    return fallback[key];
  } else {
    return input[key];
  }
}
