import { internal } from '../utils/internal';
import { fields } from '../resource/fields';

export default function selectors<T>(name, options, resource) {
  const scope = (state) => {
    const scope = state[`${name}Batch`];
    if (!scope) throw new Error(`Register reducer of batch ${name} in the store under: "${name}Batch"`)
    return scope;
  };
  return {
    creating: (state) => scope(state).creating,
    reading: (state) => scope(state).reading,
    updating: (state) => scope(state).updating,
    deleting: (state) => scope(state).deleting,
    sourceItems: (state): T[] => scope(state).items,
    item: (state): T => scope(state).item
  }
}
