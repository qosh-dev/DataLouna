import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from "fastify";

export abstract class Module {

  
  
  abstract opts: FastifyRegisterOptions<FastifyPluginOptions>;

  abstract use(fastify: FastifyInstance): Promise<void> 
}