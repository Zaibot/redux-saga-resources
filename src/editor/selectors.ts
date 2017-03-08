import { IEditorOptions, IEditorSelectors } from '.';
import { IResource } from '../resource';

export default function selectors<T>(name: string, options: IEditorOptions, resource: IResource<T>): IEditorSelectors<T> {
  const scope = (state: any) => {
    const scopeName = state[`${name}Editor`];
    if (!scopeName) {
      throw new Error(`Register reducer of resource ${name} in the store under: "${name}Editor"`);
    }
    return scopeName;
  };
  return {
    creating: (state: any) => scope(state).creating as boolean,
    deleting: (state: any) => scope(state).deleting as boolean,
    error: (state: any) => scope(state).error as string,
    isItem: (item: T) => (state: any) => resource.hasSameId(item, scope(state).item) as boolean,
    item: (state: any) => scope(state).item as T,
    original: (item: T) => resource.selectors.itemByItem(item),
    reading: (state: any) => scope(state).reading as boolean,
    updating: (state: any) => scope(state).updating as boolean,
  };
}
