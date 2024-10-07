# Example Web Server with Fastify

This project is a Fastify-based web server that interacts with PostgreSQL and Redis. It includes functionality to handle user balances, fetch item data from external APIs (Skinport), and cache results with Redis for improved performance. Additionally, the server uses request-id for tracking and logs requests with Pino.

## Features:

<ul>
<li>User Management: Create users.</li>
<li>Item Management: Fetch items from the Skinport API and cache them and buy item.</li>
<li>Database Support: PostgreSQL is used for storing user balances.</li>
<li>Caching: Redis caching is implemented for the Skinport API results.</li>
<li>Migrations: Easily manage database migrations with custom scripts.</li>
<li>Request Logging: Pino is used for structured logging, with every request being logged with a unique request-id for traceability.</li>
<li>Environment Variables: Configuration is handled using environment variables for different environments.</li>
</ul>

## Tech Stack:

<ul>
<li>Fastify - Lightweight and efficient web framework for Node.js.</li>
<li>PostgreSQL - Database for storing user balances.</li>
<li>Redis - In-memory data store used for caching.</li>
<li>Pino - High-performance logging library for structured logs.</li>
<li>TypeScript - TypeScript is used for type safety.</li>
</ul>

## Prerequisites:

<ul>
<li>Docker and Docker Compose installed</li>
<li>Node.js and npm installed</li>
</ul>

## Setup Instructions:

<ol>
  <li> 
    Clone this repository.
  
    git clone https://github.com/qosh-dev/DataLouna
    cd DataLouna
  </li>
  <li> 
    Copy the .env.example to .env

    cp .env.example .env

  </li>
  <li> 
    To set up the required Docker containers for PostgreSQL and Redis, run the following script. This script not only launches the Docker containers but also creates a role and database using the environment variables provided in your .env file.

    sh scripts/build-local.sh

This script will:
<ul>
<li>Verify that required environment variables (e.g., DB_USER, DB_PASS, DB_NAME) are set.</li>
<li>Create the necessary directories and init.sql file to initialize the PostgreSQL database with the specified user and database.</li>
<li>Start the Docker containers for PostgreSQL and Redis using docker-compose.</li>
</ul>

  </li>
  <li> 
    Install dependencies

    npm install

  </li>
  <li> 
    Run the Application

    # Development mode
    npm run start

    # Watch mode (auto-restart on changes)
    npm run start:watch

    # Production mode
    npm run start:prod

  </li>
</ol>
The application will run on:
    
    http://localhost:8000



## Environment Variables:
Make sure to set the following environment variables in your .env file:

    PORT=8000
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_NAME=your_db_name
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=your_redis_password


## API Endpoints:

<ol>
  <li>
    User Routes
    <ul>
      <li>
        Create user
          <code>POST /api/user</code>
      </li>
    </ul>
  </li>
    <li>
    Items Routes
    <ul>
      <li>
        Fetch Items
          <code>GET /api/items/many?app_id={app_id}&currency={currency}</code>
      </li>
      <li>
        Buy item
          <code>
            POST /api/items/buy 
          </code>
              
    {
      "user_id": 1,
      "product_name": "10 Year Birthday Sticker Capsule",
      "app_id": 730,
      "currency": "EUR"
    }
.
      </li>
    </ul>
  </li>

</ol>

## Database Migrations:

You can manage your database schema using the custom migration script.

### Running Migrations

    # Run migration context
    npm run migration

This script provides options to create, apply, and rollback migrations.

### Logging:

Pino is used as the logger for the application. Each request is automatically logged with a request-id to help trace requests throughout the system. The logs can be found in ./logs/app.log in production mode or displayed in the console in development.

### Caching with Redis:

The API results from the /api/items/many endpoint are cached in Redis for 30 minutes, significantly improving performance for subsequent requests.


## SQLPad

For local database browsing, the app includes SQLPad, available at:

    http://localhost:2211

Login with:

    Username: admin@sqlpad.com
    Password: admin


## Extra Features

<ul>
  <li>Request ID Logging: Every request is logged with a unique request-id for better traceability in logs.</li>
  <li>Structured Logging: Pino is used for structured, high-performance logging.</li>
</ul>

