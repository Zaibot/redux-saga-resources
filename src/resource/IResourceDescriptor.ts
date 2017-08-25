import { IActions } from './IActions';
import { IDataSelectors } from './IDataSelectors';
import { IFieldSelectors } from './IFieldSelectors';
import { IResourceOptions } from './IResourceOptions';
import { ISelectors } from './ISelectors';

export interface IResourceDescriptor<T> {
  name: string;
  options: IResourceOptions;
  actions: IActions<T>;
  selectors: ISelectors<T>;
  fields: IFieldSelectors<T>;
  data: IDataSelectors<T>;
  hasSameId(left: T, right: T): boolean;
}
