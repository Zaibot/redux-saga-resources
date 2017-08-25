import { IAction } from '@zaibot/fsa/es5';
import { IResourceDescriptor } from './IResourceDescriptor';

export interface IResource<T> extends IResourceDescriptor<T> {
  create(props: Partial<T>): Partial<T>;
  reducer(state: any, action: IAction): any;
  saga(): any;
}
