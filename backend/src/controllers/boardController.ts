import { Request, Response } from 'express';
import { boardService } from '../services/boardService';
import { ApiResponse, CreateBoardRequest, UpdateBoardRequest } from '../types';

export class BoardController {
  // GET /api/boards
  async getAllBoards(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      let boards;

      if (userId && typeof userId === 'string') {
        // 根据用户ID过滤boards
        boards = await boardService.getBoardsForUser(userId);
      } else {
        // 获取所有boards
        boards = await boardService.getAllBoards();
      }

      const response: ApiResponse = {
        success: true,
        data: boards,
        message: 'Boards retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting boards:', error);
      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to retrieve boards',
      };
      res.status(500).json(response);
    }
  }

  // GET /api/boards/:id
  async getBoardById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const board = await boardService.getBoardById(id);

      if (!board) {
        const response: ApiResponse = {
          success: false,
          error: 'Board not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: board,
        message: 'Board retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting board:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve board',
      };
      res.status(500).json(response);
    }
  }

  // GET /api/boards/:id/with-columns
  async getBoardWithColumns(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const board = await boardService.getBoardWithColumns(id);

      if (!board) {
        const response: ApiResponse = {
          success: false,
          error: 'Board not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: board,
        message: 'Board with columns retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting board with columns:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve board with columns',
      };
      res.status(500).json(response);
    }
  }

  // GET /api/boards/:id/full
  async getBoardWithFullData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const board = await boardService.getBoardWithFullData(id);

      if (!board) {
        const response: ApiResponse = {
          success: false,
          error: 'Board not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: board,
        message: 'Board with full data retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting board with full data:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve board with full data',
      };
      res.status(500).json(response);
    }
  }

  // POST /api/boards
  async createBoard(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateBoardRequest = req.body;

      if (!data.name || data.name.trim() === '') {
        const response: ApiResponse = {
          success: false,
          error: 'Board name is required',
        };
        res.status(400).json(response);
        return;
      }

      const board = await boardService.createBoard(data);
      const response: ApiResponse = {
        success: true,
        data: board,
        message: 'Board created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating board:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create board',
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/boards/:id
  async updateBoard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateBoardRequest = req.body;

      if (!(await boardService.boardExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Board not found',
        };
        res.status(404).json(response);
        return;
      }

      const board = await boardService.updateBoard(id, data);
      const response: ApiResponse = {
        success: true,
        data: board,
        message: 'Board updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating board:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update board',
      };
      res.status(500).json(response);
    }
  }

  // DELETE /api/boards/:id
  async deleteBoard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!(await boardService.boardExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Board not found',
        };
        res.status(404).json(response);
        return;
      }

      await boardService.deleteBoard(id);
      const response: ApiResponse = {
        success: true,
        message: 'Board deleted successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error deleting board:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete board',
      };
      res.status(500).json(response);
    }
  }
}

export const boardController = new BoardController();
