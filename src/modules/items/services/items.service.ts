import { FastifyRedis } from '@fastify/redis';
import { IPostItemBy } from '../schemas/post-item-buy.schema';
import { CurrencyEnum } from '../types/currency.enum';
import { IItem } from '../types/item';
import { AppId } from '../types/types';
import { ItemsRepository } from './items.repository';

export default class ItemsService {
  private readonly CACHE_TTL = 30 * 60

  constructor(
    private readonly redisClient: FastifyRedis,
    private readonly itemsRepository: ItemsRepository,
  ) { 
  }

  async getItems(
    app_id: AppId = '730',
    currency: CurrencyEnum = CurrencyEnum.EUR
  ): Promise<IItem[]> {
    
    const cacheKey = `items2:${app_id}:${currency}`;

    const cachedItems = await this.redisClient.get(cacheKey);
    if (cachedItems) {
      return JSON.parse(cachedItems);
    }

    const items = await this.itemsRepository.getItems(app_id, currency);
    await this.cacheItems(cacheKey, items);

    return items;
  }

  async buyItem(payload: IPostItemBy) {
    let item = await this.getItemByName(payload.product_name);

    if (!item) {
      await this.getItems(payload.app_id, payload.currency);
      item = await this.getItemByName(payload.product_name);
    }

    if (!item) {
      throw { statusCode: 404, message: "Product not found" };
    }

    const price = item.min_prices.tradable_price;

    return this.itemsRepository.buyItem({ user_id: payload.user_id, price })
  }

  private async cacheItems(cacheKey: string, items: IItem[]): Promise<void> {
    await this.redisClient.set(cacheKey, JSON.stringify(items), 'EX', this.CACHE_TTL);

    if (items.length) {
      const pipeline = this.redisClient.pipeline();
      items.forEach((item) => {
        const itemCacheKey = `item:${item.name}`;
        pipeline.set(itemCacheKey, JSON.stringify(item), 'EX', this.CACHE_TTL);
      });
      await pipeline.exec();
    }
  }

  private async getItemByName(name: string): Promise<IItem | null> {
    const cacheKey = `item:${name}`;
    const cachedItem = await this.redisClient.get(cacheKey);
    return cachedItem ? JSON.parse(cachedItem) : null;
  }
}
