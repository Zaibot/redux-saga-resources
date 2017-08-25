import { IMiddleware } from '../utils';
import { IResourceDescriptor } from './IResourceDescriptor';

export type IMiddlewareFactory<T> = (resource: IResourceDescriptor<T>) => IMiddleware<any>;
