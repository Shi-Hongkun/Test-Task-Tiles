import { httpClient, handleApiResponse } from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const taskService = {
  // Get all tasks for a column
  async getTasksByColumnId(columnId: string): Promise<Task[]> {
    const response = await httpClient.get<Task[]>(`/columns/${columnId}/tasks`);
    return handleApiResponse(response);
  },

  // Get task by ID
  async getTaskById(id: string): Promise<Task> {
    const response = await httpClient.get<Task>(`/tasks/${id}`);
    return handleApiResponse(response);
  },

  // Create new task
  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await httpClient.post<Task>('/tasks', data);
    return handleApiResponse(response);
  },

  // Update task
  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await httpClient.put<Task>(`/tasks/${id}`, data);
    return handleApiResponse(response);
  },

  // Update task position (for drag & drop between columns)
  async updateTaskPosition(
    id: string,
    columnId: string,
    position: number
  ): Promise<Task> {
    const response = await httpClient.put<Task>(`/tasks/${id}/position`, {
      columnId,
      position,
    });
    return handleApiResponse(response);
  },

  // Delete task
  async deleteTask(id: string): Promise<void> {
    const response = await httpClient.delete(`/tasks/${id}`);
    handleApiResponse(response);
  },
};
