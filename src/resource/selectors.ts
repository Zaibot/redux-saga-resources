import { internal } from '../utils/internal';
import { fields } from './fields';

export default function selectors(name, options, hasSameId) {
  const scope = (state) => {
    const scope = state[`${name}Resource`];
    if (!scope) throw new Error(`Register reducer of resource ${name} in the store under: "${name}Resource"`)
    return scope;
  };
  return {
    loading: (state) => scope(state).loading,
    error: (state) => scope(state).error,
    itemById: (id) => (state) => scope(state).list.filter(item => hasSameId(item, { [options.id]: id }))[0],
    itemByItem: (item) => (state) => scope(state).list.filter(existing => hasSameId(item, existing))[0],
    items: (state) => scope(state).list,
    params: (state) => scope(state).params
  }
}
