CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  balance DECIMAL(10, 2) DEFAULT 100000
);