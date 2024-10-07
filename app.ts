import Fastify from 'fastify';
import { LoggerConfig } from './src/lib/logger/logger.config';
import registerPlugins from './src/plugins';
import { IEnv } from './src/plugins/env-validator/env.config';

async function bootstrap() {
  const fastify = Fastify({
    logger: new LoggerConfig()
  });
  await registerPlugins(fastify);
  const port = fastify.getEnvs<IEnv>().PORT;
  const address = await fastify.listen({ port });
  fastify.log.info(`Server is running at ${address}`);
}

bootstrap();
