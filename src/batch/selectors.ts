import { IBatchOptions } from '.';
import { IResource } from '../resource';

export default function selectors<T>(name: string, options: IBatchOptions<T>, resource: IResource<T>) {
  const scope = (state: any) => {
    const scopeName = state[`${name}Batch`];
    if (!scopeName) {
      throw new Error(`Register reducer of batch ${name} in the store under: "${name}Batch"`);
    }
    return scopeName;
  };
  return {
    creating: (state: any) => scope(state).creating,
    deleting: (state: any) => scope(state).deleting,
    item: (state: any): T => scope(state).item,
    reading: (state: any) => scope(state).reading,
    sourceItems: (state: any): T[] => scope(state).items,
    updating: (state: any) => scope(state).updating,
  };
}
