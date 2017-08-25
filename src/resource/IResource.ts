import { Action } from 'redux';
import { IResourceDescriptor } from './IResourceDescriptor';

export interface IResource<T> extends IResourceDescriptor<T> {
  create(props: T | any): any;
  reducer(state: any, action: Action): any;
  saga(): any;
}
