const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

// --------------------------------------------------------------------------------
// 
// --------------------------------------------------------------------------------

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: +process.env.DB_PORT,
};

const migrationsDir = join(__dirname, '../src/plugins/database/migrations');


// --------------------------------------------------------------------------------
// 
// --------------------------------------------------------------------------------

async function runAllMigrations(direction) {
  const client = new Client(config);
  await client.connect();

  try {
    const migrationDirs = readdirSync(migrationsDir).sort();

    for (const dir of direction === 'up' ? migrationDirs : migrationDirs.reverse()) {
      const filePath = join(migrationsDir, dir, `${direction}.sql`);
      const query = readFileSync(filePath, 'utf8');
      console.log(`${direction === 'up' ? 'Applying' : 'Rolling back'} migration: ${filePath}`);
      await client.query(query);
    }

    console.log(`All migrations ${direction === 'up' ? 'applied' : 'rolled back'} successfully.`);
  } catch (err) {
    console.error(`Error ${direction === 'up' ? 'applying' : 'rolling back'} migrations:`, err);
  } finally {
    await client.end();
  }
}

// Выполнение одной миграции (вверх или вниз)
async function runOneMigration(direction, migrationName) {
  const client = new Client(config);
  await client.connect();

  try {
    const filePath = join(migrationsDir, migrationName, `${direction}.sql`);
    const query = readFileSync(filePath, 'utf8');
    console.log(`${direction === 'up' ? 'Applying' : 'Rolling back'} migration: ${filePath}`);
    await client.query(query);
    console.log(`Migration ${migrationName} ${direction === 'up' ? 'applied' : 'rolled back'} successfully.`);
  } catch (err) {
    console.error(`Error ${direction === 'up' ? 'applying' : 'rolling back'} migration:`, err);
  } finally {
    await client.end();
  }
}

module.exports = { runAllMigrations, runOneMigration };
