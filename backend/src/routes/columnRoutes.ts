import { Router } from 'express';
import { columnController } from '../controllers/columnController';

const router: Router = Router();

// GET /api/columns/:id - Get column by ID
router.get('/:id', columnController.getColumnById.bind(columnController));

// POST /api/columns - Create new column
router.post('/', columnController.createColumn.bind(columnController));

// PUT /api/columns/:id - Update column
router.put('/:id', columnController.updateColumn.bind(columnController));

// PUT /api/columns/:id/position - Update column position
router.put(
  '/:id/position',
  columnController.updateColumnPosition.bind(columnController)
);

// DELETE /api/columns/:id - Delete column
router.delete('/:id', columnController.deleteColumn.bind(columnController));

export default router;
