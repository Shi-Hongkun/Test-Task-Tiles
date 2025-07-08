import { httpClient, handleApiResponse } from './api';
import {
  Column,
  ColumnWithTasks,
  CreateColumnRequest,
  UpdateColumnRequest,
} from '../types';

export const columnService = {
  // Get all columns for a board
  async getColumnsByBoardId(boardId: string): Promise<ColumnWithTasks[]> {
    const response = await httpClient.get<ColumnWithTasks[]>(
      `/boards/${boardId}/columns`
    );
    return handleApiResponse(response);
  },

  // Get column by ID
  async getColumnById(id: string): Promise<ColumnWithTasks> {
    const response = await httpClient.get<ColumnWithTasks>(`/columns/${id}`);
    return handleApiResponse(response);
  },

  // Create new column
  async createColumn(data: CreateColumnRequest): Promise<Column> {
    const response = await httpClient.post<Column>('/columns', data);
    return handleApiResponse(response);
  },

  // Update column
  async updateColumn(id: string, data: UpdateColumnRequest): Promise<Column> {
    const response = await httpClient.put<Column>(`/columns/${id}`, data);
    return handleApiResponse(response);
  },

  // Update column position (for drag & drop)
  async updateColumnPosition(
    id: string,
    position: number
  ): Promise<ColumnWithTasks> {
    const response = await httpClient.put<ColumnWithTasks>(
      `/columns/${id}/position`,
      { position }
    );
    return handleApiResponse(response);
  },

  // Delete column
  async deleteColumn(id: string): Promise<void> {
    const response = await httpClient.delete(`/columns/${id}`);
    handleApiResponse(response);
  },
};
