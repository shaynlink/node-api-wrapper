import {
    type IncomingMessage,
    ServerResponse,
    STATUS_CODES
} from 'node:http';
import type { IncomingMessageApi } from './IncomingMessageApi';

export class ServerResponseApi<Request extends IncomingMessage = IncomingMessageApi> extends ServerResponse<Request> {
    status(code: number): this {
        this.statusCode = code;
        this.statusMessage = STATUS_CODES[code] as string;
        return this;
    }

    json<T = any>(json: T): void {
        let data;
        try {
            data = JSON.stringify(json);
        } catch(error) {
            console.error(error);
            this.status(500);
            this.write('Unable to parse json');
            this.end();
            return;
        }

        this.writeHead(200, 'OK', {
            'Content-Length': data.length,
            'Content-Type': 'application/json'
        }).write(data, () => {
            this.end();
        });
    }
}