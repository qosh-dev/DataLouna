import { FastifyInstance } from 'fastify';
import modules from '../modules';
import alsPlugin from './als/als.plugin';
import databasePlugin from './database/database.plugin';
import envValidatorPlugin from './env-validator/env-validator.plugin';
import exceptionPlugin from './exception/exception.plugin';
import redisPlugin from './redis/redis.plugin';

export default async function registerPlugins(
  app: FastifyInstance
): Promise<void> {
  try {
    const globalPrefix = 'api';
		await app.register(alsPlugin)
    await app.register(envValidatorPlugin);
    await app.register(redisPlugin);
    await app.register(databasePlugin);
    await app.register(exceptionPlugin);

    app.get('/error', async (request, reply) => {
      throw {
        statusCode: 500,
        message: 'This is a server error.'
      }
    });
    app.register(
      async (fastify) => {
        for (let module of modules) {
          await fastify.register(module.use, module.opts);
        }
      },
      { prefix: `/${globalPrefix}` }
    );

    app.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'The route you are looking for does not exist.'
      });
    });

  } catch (err) {
    app.log.error('Error registering plugins and routes:', err);
    throw err;
  }
}
