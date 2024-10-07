import redis from "@fastify/redis";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Envs } from "../env-validator/env-validator.plugin";

const redisPlugin = async (app: FastifyInstance) => {
	try {
		const config = {
			url: `redis://:${Envs.REDIS_PASSWORD}@${Envs.REDIS_HOST}:${Envs.REDIS_PORT}`
		}
		await app.register(redis, config)
		app.log.info("Redis plugin registered successfully.");
	} catch (err) {
		app.log.error("Error connecting to Redis:", err);
		throw err;
	}
};

export default fp(redisPlugin);
