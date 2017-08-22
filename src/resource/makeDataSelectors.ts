import { IResourceOptions } from '.';

export function makeDataSelectors<T>(options: IResourceOptions) {
    return {
        id: (item: T) => item[options.id],
    };
}
