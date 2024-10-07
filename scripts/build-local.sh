#!/bin/bash

set -a
source .env
set +a

required_envs=("DB_USER" "DB_PASS" "DB_NAME")
for env_var in "${required_envs[@]}"; do
  if [ -z "${!env_var}" ]; then
    echo "Error: $env_var is not set. Please check your .env file."
    exit 1
  fi
done

mkdir -p ./docker/data/postgres/init

if [ ! -f ./docker/data/postgres/init/init.sql ]; then
  cat <<EOF >./docker/data/postgres/init/init.sql
-- Create role
DO
\$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
      CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';
   END IF;
END
\$\$;

-- Create database
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};

EOF
fi

docker-compose -f docker/docker-compose.local.yaml up -d --build
docker-compose -f docker/docker-compose.local.yaml restart koliko_postgres
