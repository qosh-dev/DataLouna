import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { IRequestContext, SystemHeaders } from '../../lib/logger/context.type';

export let asyncLocalStorage: AsyncLocalStorage<IRequestContext>;

const alsProvider = async (app: FastifyInstance) => {
  asyncLocalStorage = new AsyncLocalStorage<IRequestContext>();

  app.addHook('onRequest', (request, reply, done) => {
    let store = asyncLocalStorage.getStore() ?? ({} as IRequestContext);
    const requestId =
      (request.headers[SystemHeaders.xRequestId] as string) || randomUUID();

    store = {
      ...store,
      [SystemHeaders.xRequestId]: requestId
    };
    asyncLocalStorage.run(store, () => {
      done();
    });
  });

  app.addHook('onResponse', (request, reply, done) => {
    let store = asyncLocalStorage.getStore() ?? ({} as IRequestContext);
    const requestId = store[SystemHeaders.xRequestId];

    if (requestId) {
      reply.header('x-request-id', requestId);
    }
    done();
  });
};

export default fp(alsProvider);
