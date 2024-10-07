import { RouteShorthandOptions } from 'fastify';
import { CurrencyEnum } from '../types/currency.enum';
import { AppId } from '../types/types';

export interface IPostItemBy {
  user_id: number;
  product_name: string; 
  app_id: AppId;
  currency: CurrencyEnum;
}

export interface IPostItemByResponse {
  message: string;
}

// --------------------------------------------------------------------
const bodySchema = {
  type: 'object',
  properties: {
    user_id: { type: 'number' },
    product_name: { type: 'string' }, 
    app_id: { type: 'string' },
    currency: { type: 'string' }
  },
  required: ['user_id', 'product_name', 'app_id', 'currency']
};

const responseSchema = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      balance: { type: 'number' },
      message: { type: 'string' }
    }
  },
  400: {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      message: { type: 'string' }
    }
  },
  404: {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      message: { type: 'string' }
    }
  },
  429: {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      message: { type: 'string' }
    }
  }
};

// --------------------------------------------------------------------

export const PostItemBuy: RouteShorthandOptions = {
  schema: {
    body: bodySchema,
    response: responseSchema
  }
};
// --------------------------------------------------------------------
