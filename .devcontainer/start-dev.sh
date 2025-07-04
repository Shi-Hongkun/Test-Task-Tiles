#!/bin/bash
set -e

echo "🔧 Starting development container setup..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  echo "PostgreSQL is unavailable - sleeping for 2 seconds"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Generate Prisma client
echo "🔄 Generating Prisma client..."
pnpm db:generate

echo "🎉 Development container setup complete!" 