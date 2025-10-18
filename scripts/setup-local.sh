#!/bin/bash

# Setup local environment

# 1. Create .env file from example
cp .env.example .env

# 2. Install dependencies
pnpm install

# 3. Start database for migration
docker compose up -d postgres

# 4. Run migrations
pnpm db:migrate

# 5. Run seed
pnpm db:seed

# 6. Stop database
docker compose down postgres

echo ""
echo "================================================"
echo ""
echo "Local environment setup complete. Run 'docker compose up -d' and then 'pnpm dev' to start the app."
echo ""
echo "================================================"