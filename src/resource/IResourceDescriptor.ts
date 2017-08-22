import { IActions } from "./IActions";
import { ICreators } from "./ICreators";
import { ISelectors } from "./ISelectors";
import { IFieldSelectors } from "./IFieldSelectors";
import { IResourceOptions } from "./IResourceOptions";
import { IDataSelectors } from "./IDataSelectors";

export interface IResourceDescriptor<T> {
  name: string;
  options: IResourceOptions;
  actions: IActions;
  creators: ICreators<T>;
  selectors: ISelectors<T>;
  fields: IFieldSelectors<T>;
  data: IDataSelectors<T>;
  hasSameId(left: T, right: T): boolean;
}
