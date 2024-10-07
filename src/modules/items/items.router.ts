import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { GetManyItemsSchema, IItemsQuery } from './schemas/get-items.schema';
import { IPostItemBy, PostItemBuy } from './schemas/post-item-buy.schema';
import ItemsService from './services/items.service';
const path = require('path');

export function InitItemsRouter(
  app: FastifyInstance,
  itemsService: ItemsService
) {
  // ------------------------------------------------------------------------------------

  app.get(
    '/many',
    { schema: GetManyItemsSchema.schema },
    async (
      request: FastifyRequest<{ Querystring: IItemsQuery }>,
      reply: FastifyReply
    ) => {
      const { app_id, currency } = request.query;
      const items = await itemsService.getItems(app_id, currency);
      return reply.send(items);
    }
  );

  app.post(
    '/buy',
    { schema: PostItemBuy.schema },
    async (
      req: FastifyRequest<{ Body: IPostItemBy }>,
      rep: FastifyReply
    ) => {

      const result = await itemsService.buyItem(req.body);
      return rep.send(result);
    }
  );

  // ------------------------------------------------------------------------------------
}
