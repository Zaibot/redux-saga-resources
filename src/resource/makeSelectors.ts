import 'arrayq';
import { IResourceOptions, ISelectors } from '.';

export function makeSelectors<T>(name: string, options: IResourceOptions, hasSameId: (l: T, r: T) => boolean): ISelectors<T> {
    const scope = (state: any) => {
        const s = state[`${name}Resource`];
        if (!s) {
            throw new Error(`Register reducer of resource ${name} in the store under: "${name}Resource"`);
        }
        return s;
    };
    return {
        error: (state: any) => scope(state).error as string,
        itemById: (id: any) => (state: any) => scope(state).list.qFirst((item: T) => hasSameId(item, { [options.id]: id } as any)),
        itemByItem: (item: T) => (state: any) => scope(state).list.qFirst((existing: T) => hasSameId(item, existing)),
        items: (state: any) => scope(state).list as T[],
        loading: (state: any) => scope(state).loading as boolean,
        params: (state: any) => scope(state).params as any,
    };
}
