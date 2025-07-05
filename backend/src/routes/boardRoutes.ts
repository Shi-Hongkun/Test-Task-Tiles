import { Router, type Router as ExpressRouter } from 'express';
import { boardController } from '../controllers/boardController';

const router: ExpressRouter = Router();

// GET /api/boards - Get all boards
router.get('/', boardController.getAllBoards.bind(boardController));

// GET /api/boards/:id - Get board by ID
router.get('/:id', boardController.getBoardById.bind(boardController));

// GET /api/boards/:id/with-columns - Get board with columns
router.get(
  '/:id/with-columns',
  boardController.getBoardWithColumns.bind(boardController)
);

// GET /api/boards/:id/full - Get board with full data (columns and tasks)
router.get(
  '/:id/full',
  boardController.getBoardWithFullData.bind(boardController)
);

// POST /api/boards - Create new board
router.post('/', boardController.createBoard.bind(boardController));

// PUT /api/boards/:id - Update board
router.put('/:id', boardController.updateBoard.bind(boardController));

// DELETE /api/boards/:id - Delete board
router.delete('/:id', boardController.deleteBoard.bind(boardController));

export default router;
