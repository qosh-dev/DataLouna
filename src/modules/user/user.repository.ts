import { PostgresDb } from '@fastify/postgres';
import { ClientBase } from 'pg';

class UserRepository {
  constructor( readonly db: PostgresDb) {}

  async createUser(): Promise<any> {
    const client = await this.db.connect();
    try {
      const result = await client.query('INSERT INTO users DEFAULT VALUES RETURNING *');
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getUserBalanceForUpdate(client: ClientBase, userId: number): Promise<number> {
    const result = await client.query('SELECT balance FROM users WHERE id = $1 FOR UPDATE', [userId]);
    if (result.rows.length === 0) {
      throw { statusCode: 404, message: `User with id ${userId} not found.` };
    }
    return result.rows[0].balance;
  }

  async updateUserBalance(client: ClientBase, userId: number, newBalance: number): Promise<void> {
    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);
  }
}

export default UserRepository;
