import { IMiddleware } from '../utils';
import { IResourceDescriptor } from './IResourceDescriptor';

export interface IMiddlewareFactory<T> {
  (resource: IResourceDescriptor<T>): IMiddleware<any>;
}
