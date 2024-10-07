import fastifyPostgres from "@fastify/postgres";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ClientConfig } from "pg";
import { Envs } from "../env-validator/env-validator.plugin";

const databasePlugin = async (app: FastifyInstance) => {
	try {
		const config: ClientConfig = {
			database: Envs.DB_NAME,
			host: Envs.DB_HOST,
			port: Envs.DB_PORT,
			user: Envs.DB_USER,
			password: Envs.DB_PASS,
		}

		await app.register(fastifyPostgres, config);
		app.log.info("PostgreSQL plugin registered successfully.");
	} catch (err) {
		app.log.error("Error connecting to database:", err);
		throw err;
	}
};

export default fp(databasePlugin);
