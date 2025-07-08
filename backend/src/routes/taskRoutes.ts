import { Router } from 'express';
import { taskController } from '../controllers/taskController';

const router: Router = Router();

// GET /api/tasks/:id - Get task by ID
router.get('/:id', taskController.getTaskById.bind(taskController));

// POST /api/tasks - Create new task
router.post('/', taskController.createTask.bind(taskController));

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask.bind(taskController));

// PUT /api/tasks/:id/position - Update task position (drag & drop)
router.put(
  '/:id/position',
  taskController.updateTaskPosition.bind(taskController)
);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
