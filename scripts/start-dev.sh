#!/bin/bash
set -e

echo "🚀 Starting Task Tiles development environment..."

# Check if PostgreSQL is running
if ! nc -z postgres 5432; then
    echo "❌ PostgreSQL is not running. Please start docker-compose services first."
    exit 1
fi

echo "✅ PostgreSQL is running"

# Generate Prisma client if needed
echo "🔄 Generating Prisma client..."
pnpm --filter backend db:generate

echo "🎯 Starting backend server on port 3001..."
PORT=3001 pnpm --filter backend dev &
BACKEND_PID=$!

echo "🎨 Starting frontend server on port 5173..."
pnpm --filter frontend dev &
FRONTEND_PID=$!

echo "🎉 Development servers started!"
echo "📊 Backend API: http://localhost:3001"
echo "🌐 Frontend App: http://localhost:5173"
echo "🔧 Health Check: http://localhost:3001/health"

# Wait for user to stop the servers
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# Wait for background processes
wait 