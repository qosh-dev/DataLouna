
import * as path from "path";
import { Worker } from 'worker_threads';
import UserRepository from '../../user/user.repository';
import { CurrencyEnum } from '../types/currency.enum';
import { IItem } from '../types/item';
import { AppId } from '../types/types';

export class ItemsRepository {
  constructor(
    private readonly userRepository: UserRepository
  ) {
  }


  getItems(app_id: AppId, currency: CurrencyEnum): Promise<IItem[]> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(__dirname, 'items-fetch.process.js')
      );
      worker.postMessage({ app_id, currency })
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  async buyItem(payload: { user_id: number, price: number }) {
    const client = await this.userRepository.db.connect();

    try {
      await client.query('BEGIN');

      const currentBalance = await this.userRepository.getUserBalanceForUpdate(client, payload.user_id);
      if (currentBalance < payload.price) {
        throw { statusCode: 400, message: `Insufficient balance for user with id ${payload.user_id}.` };
      }

      const newBalance = currentBalance - payload.price;

      await this.userRepository.updateUserBalance(client, payload.user_id, newBalance);
      await client.query('COMMIT');

      return {
        message: `Successfully withdrawn $${payload.price} from user with id ${payload.user_id}. Old balance: $${currentBalance}. New balance: $${newBalance.toFixed(2)}.`
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

}
