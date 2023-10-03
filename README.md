# Pinguin

Pinguin is a simple service for monitoring websites. It is written in Node.js and uses Redis as message broker.
Its composed of two parts: ingress and worker. Ingress is responsible for receiving HTTP requests and forwards them to
workers through BullMQ.

## Build instructions

```bash
# build an image
docker build -t haxagon/pinguin .

# push an image to private registry
docker push haxagon/pinguin
```

## Development

```bash
# install dependencies
npm install

# build
npm run build

# start local redis server
docker run -d --name redis -p 127.0.0.1:6379:6379 --rm redis:latest
```

### Start Ingress

```bash
APPLICATION_ROLE='ingress' ./node_modules/nodemon/bin/nodemon.js lib/bradlo.js
```

### Start Worker

```bash
APPLICATION_ROLE='worker' ./node_modules/nodemon/bin/nodemon.js lib/bradlo.js
```

## API

### POST /ping

```bash
curl --json '{"domain": "seznam.cz"}' -X POST localhost:3000/ping 
```
