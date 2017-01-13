import { internal, isInternal } from './internal';

var tempKeyCounter = 0;
export const makeTempKey = () => internal(`${Date.now()}_${++tempKeyCounter}_TEMP`);
export const isTempKey = (key) => isInternal(key) && /_TEMP$/.test(key);
