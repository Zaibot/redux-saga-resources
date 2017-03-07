import { IResourceOptions } from '.';
import { internal } from '../utils/internal';
import { fields } from './fields';

export default function makeDataSelectors<T>(options: IResourceOptions) {
    return {
        id: (item: T) => item[options.id],
    };
}
