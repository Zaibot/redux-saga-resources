import { RestErrors } from './RestErrors';

export function RestMiddleware(options: { url: string; id: string; }) {
    return function* internal(context: any, next: any) {
        const request: any = context.request = {
            body: undefined,
            headers: {},
            method: 'GET',
            params: {},
            url: `${options.url}`,
        };
        const response: any = context.response = {
            body: undefined,
            headers: {},
            statusCode: undefined,
            statusText: undefined,
            url: undefined,
        };

        const { list, create, read, update, remove } = context;
        if (list) {
            // List
            request.method = 'GET';
            request.url = `${options.url}`;
            request.params = list;
            yield* next();
            context.ok = RestErrors.list(response.statusCode) === false;
            context.error = RestErrors.list(response.statusCode);
            context.listed = response.body;
        } else if (read) {
            // Read
            request.method = 'GET';
            request.url = `${options.url}/${read[options.id]}`;
            yield* next();
            context.ok = RestErrors.read(response.statusCode) === false;
            context.error = RestErrors.read(response.statusCode);
            context.readed = response.body;
        } else if (create) {
            // Create
            request.method = 'POST';
            request.url = `${options.url}`;
            request.body = create;
            yield* next();
            context.ok = RestErrors.create(response.statusCode) === false;
            context.error = RestErrors.create(response.statusCode);
            context.created = response.body;
        } else if (update) {
            // Update
            request.method = 'PUT';
            request.url = `${options.url}/${update[options.id]}`;
            request.body = update;
            yield* next();
            context.ok = RestErrors.update(response.statusCode) === false;
            context.error = RestErrors.update(response.statusCode);
            context.updated = response.body;
        } else if (remove) {
            // Remove
            request.method = 'DELETE';
            request.url = `${options.url}/${remove[options.id]}`;
            yield* next();
            context.ok = RestErrors.remove(response.statusCode) === false;
            context.error = RestErrors.remove(response.statusCode);
            context.removed = response.body;
        } else {
            throw new Error('Expecting list, create, read, update or remove');
        }
    };
}
