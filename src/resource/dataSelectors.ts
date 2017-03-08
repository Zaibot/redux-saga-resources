import { IResourceOptions } from '.';

export default function makeDataSelectors<T>(options: IResourceOptions) {
    return {
        id: (item: T) => item[options.id],
    };
}
