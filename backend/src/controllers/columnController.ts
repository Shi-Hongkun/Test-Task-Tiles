import { Request, Response } from 'express';
import { columnService } from '../services/columnService';
import { boardService } from '../services/boardService';
import {
  ApiResponse,
  CreateColumnRequest,
  UpdateColumnRequest,
} from '../types';

export class ColumnController {
  // GET /api/boards/:boardId/columns
  async getColumnsByBoardId(req: Request, res: Response): Promise<void> {
    try {
      const { boardId } = req.params;

      if (!(await boardService.boardExists(boardId))) {
        const response: ApiResponse = {
          success: false,
          error: 'Board not found',
        };
        res.status(404).json(response);
        return;
      }

      const columns = await columnService.getColumnsByBoardId(boardId);
      const response: ApiResponse = {
        success: true,
        data: columns,
        message: 'Columns retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting columns:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve columns',
      };
      res.status(500).json(response);
    }
  }

  // GET /api/columns/:id
  async getColumnById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const column = await columnService.getColumnById(id);

      if (!column) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: column,
        message: 'Column retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting column:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve column',
      };
      res.status(500).json(response);
    }
  }

  // POST /api/columns
  async createColumn(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateColumnRequest = req.body;

      if (!data.name || data.name.trim() === '') {
        const response: ApiResponse = {
          success: false,
          error: 'Column name is required',
        };
        res.status(400).json(response);
        return;
      }

      if (!(await boardService.boardExists(data.boardId))) {
        const response: ApiResponse = {
          success: false,
          error: 'Board not found',
        };
        res.status(404).json(response);
        return;
      }

      // If position is not provided, get the next position
      if (data.position === undefined) {
        data.position = await columnService.getNextPosition(data.boardId);
      }

      const column = await columnService.createColumn(data);
      const response: ApiResponse = {
        success: true,
        data: column,
        message: 'Column created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating column:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create column',
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/columns/:id
  async updateColumn(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateColumnRequest = req.body;

      if (!(await columnService.columnExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      const column = await columnService.updateColumn(id, data);
      const response: ApiResponse = {
        success: true,
        data: column,
        message: 'Column updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating column:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update column',
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/columns/:id/position
  async updateColumnPosition(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { position } = req.body;

      if (typeof position !== 'number' || position < 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Valid position is required',
        };
        res.status(400).json(response);
        return;
      }

      if (!(await columnService.columnExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      const column = await columnService.updateColumnPosition(id, position);
      const response: ApiResponse = {
        success: true,
        data: column,
        message: 'Column position updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating column position:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update column position',
      };
      res.status(500).json(response);
    }
  }

  // DELETE /api/columns/:id
  async deleteColumn(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!(await columnService.columnExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      await columnService.deleteColumn(id);
      const response: ApiResponse = {
        success: true,
        message: 'Column deleted successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error deleting column:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete column',
      };
      res.status(500).json(response);
    }
  }
}

export const columnController = new ColumnController();
