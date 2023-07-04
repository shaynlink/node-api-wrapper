import {
    type Server,
    createServer,
    type ServerOptions,
} from 'node:http';
import { Collection } from './Collection';
import { IncomingMessageApi } from './IncomingMessageApi';
import { ServerResponseApi } from './ServerResponseApi';
import { Endpoint } from './Endpoint';

export type Handler = (request: IncomingMessageApi, response: ServerResponseApi) => void |
                      Promise<(request: IncomingMessageApi, response: ServerResponseApi) => void>;

export type Methods = 'ALL' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE';

export class CreateAPI {
    public endpoints: Collection<string | RegExp, Endpoint>;
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
        this.endpoints = new Collection<string | RegExp, Endpoint>();

        this.serverOptions = serverOptions;

        this.serverOptions.IncomingMessage = IncomingMessageApi;
        this.serverOptions.ServerResponse = ServerResponseApi;
    }

    public addEndpoint(
        method: Methods,
        path: string | RegExp,
        handler: Handler
    ): Endpoint {
      if (this.endpoints.has(path)) {
        const endpoint = this.endpoints.get(path);
        endpoint.addMethodHandler(method, handler);

        return endpoint;
      }

      const endpoint = new Endpoint(this, path);
      endpoint.addMethodHandler(method, handler);

      this.endpoints.set(path, endpoint);

      return endpoint;
    }

    public notFoundFn(request: IncomingMessageApi, response: ServerResponseApi): void {
        response.writeHead(404, 'Not Found').write('not found', () => {
            response.end();
        });

        return void 0;
    }

    public createServer(): this {
        this.server = createServer<typeof IncomingMessageApi, typeof ServerResponseApi>(this.serverOptions, (
            request: IncomingMessageApi,
            response: ServerResponseApi
        ) => void this.handler(request, response));

        return this;
    }

    private handler(request: IncomingMessageApi, response: ServerResponseApi): void {
        if (this.endpoints.hasKey(request.url)) {
            const endpoint = this.endpoints.get(request.url);

            if (!endpoint) return this.notFoundFn(request, response);

            let processed = false;

            if (!!endpoint.handlers.ALL) {
                void endpoint.handlers.ALL(request, response);
                processed = true;
            }
            
            if (request.method && endpoint[request.method.toUpperCase() as Methods]) {
                (endpoint.handlers[request.method.toUpperCase() as Methods] as Handler)(request, response);
                processed = true;
            }

            if (!processed) {
                return this.notFoundFn(request, response);
            }
        } else {
            return this.notFoundFn(request, response);
        }
    }
}