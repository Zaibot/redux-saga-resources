import { Status } from "./Status";

export interface IFieldSelectors<T> {
    key(item: T): string;
    id(item: T): any;
    tempId(item: T): any;
    error(item: T): any;
    isModified(item: T): Status;
    isReading(item: T): Status;
    isRead(item: T): Status;
    isCreating(item: T): Status;
    isCreated(item: T): Status;
    isRemoving(item: T): Status;
    isRemoved(item: T): Status;
    isUpdating(item: T): Status;
    isUpdated(item: T): Status;
    isUnchanged(item: T): boolean;
    isChanging(item: T): boolean;
    neverCommited(item: T): boolean;
    hasCommited(item: T): boolean;
}
