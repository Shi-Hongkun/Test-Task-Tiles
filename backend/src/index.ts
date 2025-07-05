import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { prisma } from './utils/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Task Tiles API v1.0.0',
    version: '1.0.0',
    endpoints: {
      boards: '/api/boards',
      columns: '/api/columns',
      tasks: '/api/tasks',
    },
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', notFoundHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  console.log(`📝 Boards API: http://localhost:${PORT}/api/boards`);
  console.log(`📋 Columns API: http://localhost:${PORT}/api/columns`);
  console.log(`📌 Tasks API: http://localhost:${PORT}/api/tasks`);
});
