import { IResourceDescriptor } from "./IResourceDescriptor";
import { Action } from "redux";

export interface IResource<T> extends IResourceDescriptor<T> {
  create(props: T | any): any;
  reducer(state: any, action: Action): any;
  saga(): any;
}
