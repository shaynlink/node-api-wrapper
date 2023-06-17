import {
    type Server,
    createServer,
    type ServerOptions,
} from 'node:http';
import { Collection } from './Collection';
import { IncomingMessageApi } from './IncomingMessageApi';
import { ServerResponseApi } from './ServerResponseApi';

export type Handler = (request: IncomingMessageApi, response: ServerResponseApi) => void |
                      Promise<(request: IncomingMessageApi, response: ServerResponseApi) => void>;

export type Methods = 'ALL' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE';

export type EndpointValues = {
    [key in Methods]?: Handler;
};

export class CreateAPI {
    public endpoints: Collection<string | RegExp, EndpointValues>;
    public serverOptions: ServerOptions<
        typeof IncomingMessageApi,
        typeof ServerResponseApi
    >;
    public server: Server<
        typeof IncomingMessageApi,
        typeof ServerResponseApi
    >;
    constructor(
        serverOptions: ServerOptions<
            typeof IncomingMessageApi,
            typeof ServerResponseApi
        > = {}
    ) {
        this.endpoints = new Collection<string | RegExp, EndpointValues>();

        this.serverOptions = serverOptions;

        this.serverOptions.IncomingMessage = IncomingMessageApi;
        this.serverOptions.ServerResponse = ServerResponseApi;
    }

    public addEndpoint(
        method: Methods,
        endpoint: string | RegExp,
        handler: Handler
    ): this {
        this.endpoints.set(endpoint ?? '', {[method.toUpperCase()]: handler});

        return this;
    }

    public notFoundFn(request: IncomingMessageApi, response: ServerResponseApi) {
        response.writeHead(404, 'Not Found').write('not found', () => {
            response.end();
        });
    }

    public createServer(): this {
        this.server = createServer<typeof IncomingMessageApi, typeof ServerResponseApi>(this.serverOptions, (
            request: IncomingMessageApi,
            response: ServerResponseApi
        ) => this.handler(request, response));

        return this;
    }

    private handler(request: IncomingMessageApi, response: ServerResponseApi): void {
        if (this.endpoints.hasKey(request.url ?? '')) {
            const endpoint = this.endpoints.get(request.url ?? '');

            if (!endpoint) return this.notFoundFn(request, response);

            let processed = false;

            if (endpoint.ALL) {
                endpoint.ALL(request, response);
                processed = true;
            }
            
            if (request.method && endpoint[request.method.toUpperCase() as Methods]) {
                (endpoint[request.method.toUpperCase() as Methods] as Handler)(request, response);
                processed = true;
            }

            if (!processed) {
                this.notFoundFn(request, response);
            }
        } else {
            this.notFoundFn(request, response);
        }
    }
}