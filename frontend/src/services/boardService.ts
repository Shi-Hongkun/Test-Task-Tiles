import { httpClient, handleApiResponse } from './api';
import {
  Board,
  BoardWithColumns,
  BoardWithFullData,
  CreateBoardRequest,
  UpdateBoardRequest,
} from '../types';

export const boardService = {
  // Get all boards
  async getAllBoards(): Promise<Board[]> {
    const response = await httpClient.get<Board[]>('/boards');
    return handleApiResponse(response);
  },

  // Get board by ID
  async getBoardById(id: string): Promise<Board> {
    const response = await httpClient.get<Board>(`/boards/${id}`);
    return handleApiResponse(response);
  },

  // Get board with columns
  async getBoardWithColumns(id: string): Promise<BoardWithColumns> {
    const response = await httpClient.get<BoardWithColumns>(
      `/boards/${id}/with-columns`
    );
    return handleApiResponse(response);
  },

  // Get board with full data (columns and tasks)
  async getBoardWithFullData(id: string): Promise<BoardWithFullData> {
    const response = await httpClient.get<BoardWithFullData>(
      `/boards/${id}/full`
    );
    return handleApiResponse(response);
  },

  // Create new board
  async createBoard(data: CreateBoardRequest): Promise<Board> {
    const response = await httpClient.post<Board>('/boards', data);
    return handleApiResponse(response);
  },

  // Update board
  async updateBoard(id: string, data: UpdateBoardRequest): Promise<Board> {
    const response = await httpClient.put<Board>(`/boards/${id}`, data);
    return handleApiResponse(response);
  },

  // Delete board
  async deleteBoard(id: string): Promise<void> {
    const response = await httpClient.delete(`/boards/${id}`);
    handleApiResponse(response);
  },
};
