import { Router } from 'express';
import boardRoutes from './boardRoutes';
import columnRoutes from './columnRoutes';
import taskRoutes from './taskRoutes';
import userRoutes from './userRoutes';
import { columnController } from '../controllers/columnController';
import { taskController } from '../controllers/taskController';

const router: Router = Router();

// User routes
router.use('/users', userRoutes);

// Board routes
router.use('/boards', boardRoutes);

// Column routes
router.use('/columns', columnRoutes);

// Task routes
router.use('/tasks', taskRoutes);

// Nested routes for better REST API structure
// GET /api/boards/:boardId/columns - Get columns for a board
router.get(
  '/boards/:boardId/columns',
  columnController.getColumnsByBoardId.bind(columnController)
);

// GET /api/columns/:columnId/tasks - Get tasks for a column
router.get(
  '/columns/:columnId/tasks',
  taskController.getTasksByColumnId.bind(taskController)
);

export default router;
