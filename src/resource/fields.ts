import { IFieldSelectors } from '.';
import { internal } from '../utils';

export const fields = {
    error: Symbol(internal('error')),
    id: Symbol(internal('id')),
    isCreated: Symbol(internal('isCreated')),
    isCreating: Symbol(internal('isCreating')),
    isModified: Symbol(internal('isModified')),
    isRead: Symbol(internal('isRead')),
    isReading: Symbol(internal('isReading')),
    isRemoved: Symbol(internal('isRemoved')),
    isRemoving: Symbol(internal('isRemoving')),
    isUpdated: Symbol(internal('isUpdated')),
    isUpdating: Symbol(internal('isUpdating')),
    tempId: Symbol(internal('tempId')),
};

export const fieldsAll = [
    fields.error,
    fields.id,
    fields.isCreated,
    fields.isCreating,
    fields.isModified,
    fields.isRead,
    fields.isReading,
    fields.isRemoved,
    fields.isRemoving,
    fields.isUpdated,
    fields.isUpdating,
    fields.tempId,
];

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

export const selectors: IFieldSelectors<any> = {
    error: (item: any) => item[fields.error],
    hasCommited: (item: any) => item[fields.isRead] || item[fields.isCreated] || item[fields.isRemoved] || item[fields.isUpdated],
    id: (item: any) => item[fields.id],
    isChanging: (item: any) => item[fields.isReading] || item[fields.isCreating] || item[fields.isRemoving] || item[fields.isUpdating],
    isCreated: (item: any) => item[fields.isCreated],
    isCreating: (item: any) => item[fields.isCreating],
    isModified: (item: any) => item[fields.isModified],
    isRead: (item: any) => item[fields.isRead],
    isReading: (item: any) => item[fields.isReading],
    isRemoved: (item: any) => item[fields.isRemoved],
    isRemoving: (item: any) => item[fields.isRemoving],
    isUnchanged: (item: any) => !item[fields.isReading] && !item[fields.isCreating] && !item[fields.isRemoving] && !item[fields.isUpdating],
    isUpdated: (item: any) => item[fields.isUpdated],
    isUpdating: (item: any) => item[fields.isUpdating],
    key: (item: any) => item[fields.id] || item[fields.tempId],
    neverCommited: (item: any) => !item[fields.isRead] && !item[fields.isCreated] && !item[fields.isRemoved] && !item[fields.isUpdated],
    tempId: (item: any) => item[fields.tempId],
};

export const stripFields = <T>(obj: T): T => {
    const copy = { ...(obj as any) };
    for (const key of fieldsAll) {
      delete copy[key];
    }
    return copy;
};

export const extractFields = (obj: any): any => {
    return {
        [fields.id]: obj[fields.id],
        [fields.tempId]: obj[fields.tempId],
        [fields.error]: obj[fields.error],
        [fields.isModified]: obj[fields.isModified],
        [fields.isReading]: obj[fields.isReading],
        [fields.isRead]: obj[fields.isRead],
        [fields.isCreating]: obj[fields.isCreating],
        [fields.isCreated]: obj[fields.isCreated],
        [fields.isRemoving]: obj[fields.isRemoving],
        [fields.isRemoved]: obj[fields.isRemoved],
        [fields.isUpdating]: obj[fields.isUpdating],
        [fields.isUpdated]: obj[fields.isUpdated],
    };
};

export const copyFields = <T>(target: any, fieldsSource: any) => ({ ...target, ...extractFields(fieldsSource) });
