#!/bin/bash
set -e

echo "🔧 Starting development container setup..."

# Clean up any existing processes
echo "🧹 Cleaning up old processes..."
pkill -f "vite" 2>/dev/null || echo "No vite processes to clean"
pkill -f "tsx.*backend" 2>/dev/null || echo "No backend processes to clean"

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

# Push database schema (equivalent to migration)
echo "🔄 Pushing database schema..."
pnpm db:push

# Seed database if it's empty (safe to run multiple times)
echo "🌱 Seeding database with sample data..."
pnpm db:seed || echo "⚠️  Seeding skipped (data may already exist)"

echo "🎉 Development container setup complete!" 