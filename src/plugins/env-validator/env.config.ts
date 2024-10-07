export enum NodeEnv {
  test = 'test',
  development = 'development',
  production = 'production',
}

export interface IEnv {
  NODE_ENV: NodeEnv;
  PORT: number
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

export const EnvSchema = {
  type: 'object',
  required: [
    'NODE_ENV',
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASS',
    'DB_NAME',
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_PASSWORD'
  ],
  properties: {
    NODE_ENV: {
      type: 'string',
      enum: Object.values(NodeEnv),
    },
    PORT: {
      type: 'number',
      default: '3000',
    },
    DB_HOST: {
      type: 'string',
    },
    DB_PORT: {
      type: 'number',
    },
    DB_USER: {
      type: 'string',
    },
    DB_PASS: {
      type: 'string',
    },
    DB_NAME: {
      type: 'string',
    },
    REDIS_HOST: {
      type: 'string',
    },
    REDIS_PORT: {
      type: 'number',
    },
    REDIS_PASSWORD: {
      type: 'string',
    },
  },
};
