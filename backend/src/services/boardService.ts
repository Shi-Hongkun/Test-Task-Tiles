import { prisma } from '../utils/database';
import {
  BoardDto,
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardWithColumns,
  BoardWithFullData,
} from '../types';

export class BoardService {
  // Get all boards
  async getAllBoards(): Promise<BoardDto[]> {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return boards as any;
  }

  // Get board by ID
  async getBoardById(id: string): Promise<BoardDto | null> {
    const board = await prisma.board.findUnique({
      where: { id },
    });
    return board;
  }

  // Get board with columns
  async getBoardWithColumns(id: string): Promise<BoardWithColumns | null> {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { position: 'asc' },
        },
      },
    });
    return board;
  }

  // Get board with full data (columns and tasks)
  async getBoardWithFullData(id: string): Promise<BoardWithFullData | null> {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: {
            tasks: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });
    return board;
  }

  // Create new board
  async createBoard(data: CreateBoardRequest): Promise<BoardDto> {
    const board = await prisma.board.create({
      data: {
        name: data.name,
        description: data.description,
        // Create default columns
        columns: {
          create: [
            { name: 'To Do', position: 0 },
            { name: 'In Progress', position: 1 },
            { name: 'Done', position: 2 },
          ],
        },
      },
    });
    return board;
  }

  // Update board
  async updateBoard(
    id: string,
    data: UpdateBoardRequest
  ): Promise<BoardDto | null> {
    const board = await prisma.board.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return board;
  }

  // Delete board
  async deleteBoard(id: string): Promise<boolean> {
    await prisma.board.delete({
      where: { id },
    });
    return true;
  }

  // Check if board exists
  async boardExists(id: string): Promise<boolean> {
    const board = await prisma.board.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!board;
  }
}

export const boardService = new BoardService();
