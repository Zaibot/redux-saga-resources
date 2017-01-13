import { internal } from '../utils/internal';
import { fields } from '../resource/fields';

export default function selectors(name, options, resource) {
    const scope = (state) => {
        const scope = state[`${name}Editor`];
        if (!scope) throw new Error(`Register reducer of resource ${name} in the store under: "${name}Editor"`)
        return scope;
    };
    return {
        opened: (state) => scope(state).opened,
        loading: (state) => scope(state).loading,
        error: (state) => scope(state).error,
        item: (state) => scope(state).item,
        isItem: (item) => (state) => resource.hasSameId(item, scope(state).item)
    }
}
