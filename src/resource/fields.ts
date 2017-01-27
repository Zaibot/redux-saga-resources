import { internal } from '../utils/internal';

export const fields = {
    id: Symbol(internal('id')),
    tempId: Symbol(internal('tempId')),
    error: Symbol(internal('error')),
    isModified: Symbol(internal('isModified')),
    isReading: Symbol(internal('isReading')),
    isRead: Symbol(internal('isRead')),
    isCreating: Symbol(internal('isCreating')),
    isCreated: Symbol(internal('isCreated')),
    isRemoving: Symbol(internal('isRemoving')),
    isRemoved: Symbol(internal('isRemoved')),
    isUpdating: Symbol(internal('isUpdating')),
    isUpdated: Symbol(internal('isUpdated'))
};

// export const fields = {
//     id: internal('id'),
//     tempId: internal('tempId'),
//     error: internal('error'),
//     isModified: internal('isModified'),
//     isReading: internal('isReading'),
//     isRead: internal('isRead'),
//     isCreating: internal('isCreating'),
//     isCreated: internal('isCreated'),
//     isRemoving: internal('isRemoving'),
//     isRemoved: internal('isRemoved'),
//     isUpdating: internal('isUpdating'),
//     isUpdated: internal('isUpdated')
// };

export const selectors = {
    key: (item) => item[fields.id]||item[fields.tempId],
    id: (item) => item[fields.id],
    tempId: (item) => item[fields.tempId],
    error: (item) => item[fields.error],
    isModified: (item) => item[fields.isModified],
    isReading: (item) => item[fields.isReading],
    isRead: (item) => item[fields.isRead],
    isCreating: (item) => item[fields.isCreating],
    isCreated: (item) => item[fields.isCreated],
    isRemoving: (item) => item[fields.isRemoving],
    isRemoved: (item) => item[fields.isRemoved],
    isUpdating: (item) => item[fields.isUpdating],
    isUpdated: (item) => item[fields.isUpdated],

    // computed
    isUnchanged: (item) => !item[fields.isReading]&&!item[fields.isCreating]&&!item[fields.isRemoving]&&!item[fields.isUpdating],
    isChanging: (item) => item[fields.isReading]||item[fields.isCreating]||item[fields.isRemoving]||item[fields.isUpdating],
    neverCommited: (item) => !item[fields.isRead]&&!item[fields.isCreated]&&!item[fields.isRemoved]&&!item[fields.isUpdated],
    hasCommited: (item) => item[fields.isRead]||item[fields.isCreated]||item[fields.isRemoved]||item[fields.isUpdated]
};

export const stripFields = (obj) => {
    const {
        [fields.id]: id,
        [fields.tempId]: tempId,
        [fields.error]: error,
        [fields.isModified]: isModified,
        [fields.isReading]: isReading,
        [fields.isRead]: isRead,
        [fields.isCreating]: isCreating,
        [fields.isCreated]: isCreated,
        [fields.isRemoving]: isRemoving,
        [fields.isRemoved]: isRemoved,
        [fields.isUpdating]: isUpdating,
        [fields.isUpdated]: isUpdated,
        ...remainder
    } = obj;
    const cleaned = { ...remainder };
    return cleaned;
};
