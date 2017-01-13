import { fields } from '../fields';

export function listAddOrUpdate(descriptor, list, bareItem, transform) {
  const { hasSameId } = descriptor;
    var count = 0;
    const res = list.map((item) => {
        if (!hasSameId(item, bareItem)) {
            return item;
        }
        // Update existing.
        ++count;
        const res = transform(item);
        return res;
    });
    if (count === 0) {
        // Add new.
        res.push(transform({
            ...bareItem
        }));
    }
    return res;
}

export function listRemove(descriptor, list, bareItem) {
    return list.filter(item => !descriptor.hasSameId(item, bareItem));
}
