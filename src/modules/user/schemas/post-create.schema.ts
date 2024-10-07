import { RouteShorthandOptions } from 'fastify';

export interface IPostCreateUser {
  id: number;
  balance: number;
}

// --------------------------------------------------------------------

const response = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      balance: { type: 'number' }
    }
  },
  500: {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      message: { type: 'string' }
    }
  }
};

export const PostCreateUserSchema: RouteShorthandOptions = {
  schema: {
    response
  }
};
