import fastifyEnv from "@fastify/env";
import dotEnv from "dotenv";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { EnvSchema, IEnv } from "./env.config";
dotEnv.config({ "path": ".env" });

export let Envs: IEnv;

const envValidatorPlugin = async (app: FastifyInstance) => {
  try {
    const options = {
      confKey: 'config',
      schema: EnvSchema,
      data: process.env
    }

    await app.register(fastifyEnv, options)
    Envs = app.getEnvs<IEnv>()
    
		app.log.info("Env validator plugin registered successfully.");
  } catch (err) {
    app.log.error("Error on env validation", err);
    throw err;
  }
};

export default fp(envValidatorPlugin);
