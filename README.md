# node-api-wrapper - a nodeJS API Wrapper (captain obvious)

> ⚠️ node-api-wrapper is still in development, originally created for shortlnk project, it
> evolve for the moment at the same time as shortlnk. But its development is to
> think for a general use and integrable by other projects.

# Installation guide

```bash
npm install node-api-wrapper
```

# Documentation

## global uses

import on CommonJS

```js
const { CreateAPI } = require("node-api-wrapper");
```

import on EcmaScript

```js
import { CreateAPI } from "node-api-wrapper";
```

simple example

```js
const api = new CreateAPI();

api.addEndpoint('GET', '/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

api.createServer();

api.server.listen('3000', () => console.log('server listening to port 3000'));
```

# References

# Class

# `new CreateAPI(serverOptions)`

**constructor** new (serverOptions: [`ServerOptions`](https://nodejs.org/dist/latest-v20.x/docs/api/http.html#httpcreateserveroptions-requestlistener))


| Properties    | Type   | Description    |
|---------------|--------|----------------|
| endpoints     | [`Collection`](#Collection)<string \| RegExp, [`EndpointValues`](#EndpointValues)> | Endpoints mapping (extends to Map()) |
| serverOptions | [`ServerOptions`](https://nodejs.org/dist/latest-v20.x/docs/api/http.html#httpcreateserveroptions-requestlistener) | Http server options     |
| server        | https://nodejs.org/dist/latest-v20.x/docs/api/http.html#class-httpserver | Server object |


## **method** `addEndpoint(method, endpoint, handler)`

**Parameter** method [`Methods`](#Methods)  
**Parameter** endpointer `string` | `RegExp`  
**Parameter** handler [`Handler`](#Handler)

**Return** [`this`](#CreateAPI)

```js
api.addEndpoint('GET', '/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
```

## **method** `notFoundFn(request, response)`

**Parameter** request [`IncomingMessageApi`](#IncomingMessageApi)  
**Parameter** response [`ServerResponseApi`](#ServerResponseApi)  

**Return** [`this`](#CreateAPI)

```js
api.notFoundFn();

api.notFoundFn = function(req, res) {
  res.writeHead(404, 'Not Found').write('not found', () => {
    res.end();
  })
}
```

## **method** `createServer()`

**Return** [`this`](#CreateAPI)

```js
api.createServer();

api.server.listen(3000, () => console.log('Server up'));
```

# `new Collection(entries?: [any, any][])`

**extends** `Map`   
**constructor** new (entries: `[any, any][]` = [])

| Properties | Type            | Description    |
|------------|-----------------|----------------|
| regexSbl   | Symbol('regex') | |

## **method** `get(key)`

**Parameter** key `any`  

**Return** `any` | `undefined`

```js
const collection = new Collecion();
collection.set('aa', 'hello');
collection.set(/a/gi, 'world');

collection.get('a'); // world
collection.get('aa'); // hello
collection.get('aaa'); // world
```

## **method** `set(key, value)`

**Parameter** key `any`  
**Parameter** value `any`  

**Return** [`this`](#Collection)

```js
const collection = new Collecion();
collection.set('aa', 'hello');
collection.set(/a/gi, 'world');

collection.get('a'); // world
collection.get('aa'); // hello
collection.get('aaa'); // world
```

## **method** `hasKey(key, options)`

**Parameter** key `any`  
**Parameter** options

| Property    | Type    | Required | description                       |
| ----------- | ------- | -------- | --------------------------------- |
| ignoreRegex | boolean |          | Ignore regex                      |

**Return** `boolean`

```js
const collection = new Collecion();
collection.set('aa', 'hello');
collection.set(/a/gi, 'world');

collection.hasKey('aa'); // true
collection.hasKey('a'); // true
collection.hasKey(/a/gi); // false
```

# `new IncomingMessageApi()`

**extends** `IncomingMessage`   

## **method** `getData()`

**Return** `Promise<Buffer>`

```js
const body = await req.getData();
```

## **method** `getJSON()`

**Return** `Promise<any>`

```js
const json = await req.getJSON();
```

## **method** `getParams()`

**Return** `any`

```js
const params = req.getParams();
```

# `new ServerResponseApi()`

**extends** `IncomingMessage`   

## **method** `status(code)`
**Parameter** code `number`  
**Return** [`this`](#ServerResponseApi)

```js
res.status(200);
```

## **method** `json(obj: any)`
**Parameter** obj `any`  
**Return** `Promise<any>`

```js
res.json({ status: 'OK' });
```

## Types

### `EndpointValues`

**Type** [Object] - [`key` in [`Methods`](#Methods)]?: [`Handler`](#Handler)

### `Methods`

**Type** [string] - `ALL` | `GET` | `POST` | `PUT` | `PATCH` | `DELETE` | `OPTIONS` | `HEAD` | `CONNECT` | `TRACE`

### `Handler`

**Type** [Function] - (`request`: [`IncomingMessageApi`](#IncomingMessageApi), `response`: [`ServerResponseApi`](#ServerResponseApi)) => `void`
| `Promise`<(`request`: [`IncomingMessageApi`](#IncomingMessageApi), `response`: [`ServerResponseApi`](#ServerResponseApi)) => `void`>

# Credit

- Author - [shaynlink](https://github.com/shaynlink)

© 2023 - MIT
