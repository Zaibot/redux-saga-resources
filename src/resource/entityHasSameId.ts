import { IResourceOptions } from "./IResourceOptions";
import { fields } from "./fields";

export function entityHasSameId<T>(options: IResourceOptions) {
    const { id: internalId, tempId } = fields;
    const { id } = options;
    let leftId: string;
    let rightId: string;

    return (left: T, right: T) => {
        if (left === right) {
            return true;
        }
        if (left && right) {
            // Internal ID
            leftId = left[internalId];
            rightId = right[internalId];
            if (leftId && (leftId === rightId)) {
                return true;
            }

            // Object ID
            if (id) {
                leftId = left[id];
                rightId = right[id];
                if (leftId && (leftId === rightId)) {
                    return true;
                }
            }

            // Temporary ID
            leftId = left[tempId];
            rightId = right[tempId];
            if (leftId && (leftId === rightId)) {
                return true;
            }
        }
        return false;
    };
}
