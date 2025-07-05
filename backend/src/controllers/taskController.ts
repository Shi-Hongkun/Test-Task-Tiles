import { Request, Response } from 'express';
import { taskService } from '../services/taskService';
import { columnService } from '../services/columnService';
import { ApiResponse, CreateTaskRequest, UpdateTaskRequest } from '../types';

export class TaskController {
  // GET /api/columns/:columnId/tasks
  async getTasksByColumnId(req: Request, res: Response): Promise<void> {
    try {
      const { columnId } = req.params;

      if (!(await columnService.columnExists(columnId))) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      const tasks = await taskService.getTasksByColumnId(columnId);
      const response: ApiResponse = {
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting tasks:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve tasks',
      };
      res.status(500).json(response);
    }
  }

  // GET /api/tasks/:id
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);

      if (!task) {
        const response: ApiResponse = {
          success: false,
          error: 'Task not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: task,
        message: 'Task retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting task:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve task',
      };
      res.status(500).json(response);
    }
  }

  // POST /api/tasks
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateTaskRequest = req.body;

      if (!data.title || data.title.trim() === '') {
        const response: ApiResponse = {
          success: false,
          error: 'Task title is required',
        };
        res.status(400).json(response);
        return;
      }

      if (!(await columnService.columnExists(data.columnId))) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      // If position is not provided, get the next position
      if (data.position === undefined) {
        data.position = await taskService.getNextPosition(data.columnId);
      }

      const task = await taskService.createTask(data);
      const response: ApiResponse = {
        success: true,
        data: task,
        message: 'Task created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating task:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create task',
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/tasks/:id
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateTaskRequest = req.body;

      if (!(await taskService.taskExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Task not found',
        };
        res.status(404).json(response);
        return;
      }

      // If columnId is provided, check if the column exists
      if (data.columnId && !(await columnService.columnExists(data.columnId))) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      const task = await taskService.updateTask(id, data);
      const response: ApiResponse = {
        success: true,
        data: task,
        message: 'Task updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating task:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update task',
      };
      res.status(500).json(response);
    }
  }

  // PUT /api/tasks/:id/position
  async updateTaskPosition(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { columnId, position } = req.body;

      if (!columnId || typeof position !== 'number' || position < 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Valid columnId and position are required',
        };
        res.status(400).json(response);
        return;
      }

      if (!(await taskService.taskExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Task not found',
        };
        res.status(404).json(response);
        return;
      }

      if (!(await columnService.columnExists(columnId))) {
        const response: ApiResponse = {
          success: false,
          error: 'Column not found',
        };
        res.status(404).json(response);
        return;
      }

      const task = await taskService.updateTaskPosition(id, columnId, position);
      const response: ApiResponse = {
        success: true,
        data: task,
        message: 'Task position updated successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating task position:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update task position',
      };
      res.status(500).json(response);
    }
  }

  // DELETE /api/tasks/:id
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!(await taskService.taskExists(id))) {
        const response: ApiResponse = {
          success: false,
          error: 'Task not found',
        };
        res.status(404).json(response);
        return;
      }

      await taskService.deleteTask(id);
      const response: ApiResponse = {
        success: true,
        message: 'Task deleted successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error deleting task:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete task',
      };
      res.status(500).json(response);
    }
  }
}

export const taskController = new TaskController();
