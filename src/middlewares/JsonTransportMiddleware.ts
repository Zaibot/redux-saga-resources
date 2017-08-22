

const http204 = 204;

export function* JsonTransportMiddleware({ request, response }: any, next: any) {
    request.headers.accept = 'application/json';

    if (request.body) {
        request.headers['content-type'] = 'application/json';
        request.body = JSON.stringify(request.body);
    }

    yield* next();

    if (response.statusCode === http204) {
        // No content
    } else {
        if (/^application\/json/.test(response.headers['content-type'])) {
            if (typeof response.body !== 'object' && response.body !== undefined) {
                response.body = JSON.parse(response.body);
            }
        }
    }
}
