import { IResourceDescriptor } from '../resource';
import { fields } from '../resource/fields';

export function listAddOrUpdate<T>(descriptor: IResourceDescriptor<T>, list: T[], bareItem: T, transform: (item: T) => T) {
  const { hasSameId } = descriptor;
  let count = 0;
  const res = list.map((item) => {
    if (!hasSameId(item, bareItem)) {
      return item;
    }
    // Update existing.
    ++count;
    const updated = transform(item);
    return updated;
  });
  if (count === 0) {
    // Add new.
    res.push(transform({
            ...(bareItem as any),
        }));
}
  return res;
}

export function listRemove<T>(descriptor: IResourceDescriptor<T>, list: T[], bareItem: T) {
  return list.filter((item) => !descriptor.hasSameId(item, bareItem));
}
