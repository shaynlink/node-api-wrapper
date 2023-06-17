import { IncomingMessage } from 'node:http';

export class IncomingMessageApi extends IncomingMessage {
    getData(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const buff: Buffer = Buffer.from('');
            this.on('data', (data) => Buffer.concat([buff, data], buff.length + data.length));
            this.once('end', () => {
                this.removeAllListeners('data');
                this.removeAllListeners('error');
                resolve(buff);
            });
            this.once('error', (err) => {
                this.removeAllListeners('data');
                this.removeAllListeners('end');
                reject(err);
            })
        })    
    }

    getJSON<T>(): Promise<Partial<T>> {
        return this.getData()
            .then((data: Buffer) => {
                return JSON.parse(data.toString('utf8'));
            });
    }

    getParams<T>(): Partial<T> {
        if (!this.url) return {};
        return Object.fromEntries(
            [...this.url.matchAll(/[\?&?](\w+=[\w\d-]+)/gm)]
                .map((g: RegExpMatchArray) => g[1].split('='))
        )
    }
}