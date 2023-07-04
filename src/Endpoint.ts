import { CreateAPI, Handler, Methods } from './Api';

export class Endpoint {
  instance: CreateAPI;
  handlers: {[key in Methods]?: Handler};
  endpoint: string | RegExp;
  handler: Handler;
  constructor(instance: CreateAPI, endpoint: string | RegExp) {
    this.instance = instance;
    this.handlers = {};
    this.endpoint = endpoint;
  }

  public addMethodHandler(method: Methods, handler: Handler): this {
    this.handlers[method] = handler;

    return this;
  }
}