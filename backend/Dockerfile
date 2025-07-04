# Build stage
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY backend/ ./backend/
COPY shared/ ./shared/

# Build shared package first
WORKDIR /app/shared
RUN pnpm build

# Build backend
WORKDIR /app/backend
RUN pnpm build

# Production stage
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# Set working directory to backend
WORKDIR /app/backend

# Generate Prisma client
RUN pnpm db:generate

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"] 