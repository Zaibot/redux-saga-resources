import { internal, isInternal } from './internal';

let tempKeyCounter = 0;
export const makeTempKey = () => internal(`${Date.now()}_${++tempKeyCounter}_TEMP`);
export const isTempKey = (key: string) => isInternal(key) && /_TEMP$/.test(key);
