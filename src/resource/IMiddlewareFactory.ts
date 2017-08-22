import { IResourceDescriptor } from "./IResourceDescriptor";
import { IMiddleware } from "../utils";

export interface IMiddlewareFactory<T> {
  (resource: IResourceDescriptor<T>): IMiddleware<any>;
}
