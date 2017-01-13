import { internal } from '../internal';
import { fields } from '../fields';

export default function makeDataSelectors(options) {
    return {
        id: (item) => item[options.id]
    }
}
