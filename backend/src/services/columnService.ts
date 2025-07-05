import { prisma } from '../utils/database';
import {
  ColumnDto,
  CreateColumnRequest,
  UpdateColumnRequest,
  UpdateColumnPositionRequest,
  TaskDto,
} from '../types';

export class ColumnService {
  // Helper function to convert Prisma Column to ColumnDto
  private convertColumnToDto(column: any): ColumnDto {
    return {
      id: column.id,
      name: column.name,
      position: column.position,
      boardId: column.boardId,
      createdAt: column.createdAt,
      tasks: column.tasks
        ? column.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description || undefined,
            position: task.position,
            columnId: task.columnId,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          }))
        : undefined,
    };
  }

  // Get all columns for a board
  async getColumnsByBoardId(boardId: string): Promise<ColumnDto[]> {
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
        },
      },
    });
    return columns.map((column) => this.convertColumnToDto(column));
  }

  // Get column by ID
  async getColumnById(id: string): Promise<ColumnDto | null> {
    const column = await prisma.column.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
        },
      },
    });
    return column ? this.convertColumnToDto(column) : null;
  }

  // Create new column
  async createColumn(data: CreateColumnRequest): Promise<ColumnDto> {
    const column = await prisma.column.create({
      data: {
        name: data.name,
        position: data.position,
        boardId: data.boardId,
      },
    });
    return column;
  }

  // Update column
  async updateColumn(
    id: string,
    data: UpdateColumnRequest
  ): Promise<ColumnDto | null> {
    const column = await prisma.column.update({
      where: { id },
      data: {
        name: data.name,
        position: data.position,
      },
    });
    return column;
  }

  // Delete column
  async deleteColumn(id: string): Promise<boolean> {
    await prisma.column.delete({
      where: { id },
    });
    return true;
  }

  // Update column position
  async updateColumnPosition(
    id: string,
    newPosition: number
  ): Promise<ColumnDto | null> {
    // Get current column
    const currentColumn = await prisma.column.findUnique({
      where: { id },
    });

    if (!currentColumn) {
      return null;
    }

    const oldPosition = currentColumn.position;
    const boardId = currentColumn.boardId;

    // Use transaction to update positions
    await prisma.$transaction(async (tx) => {
      if (newPosition > oldPosition) {
        // Moving down - decrease position of columns in between
        await tx.column.updateMany({
          where: {
            boardId,
            position: {
              gt: oldPosition,
              lte: newPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      } else if (newPosition < oldPosition) {
        // Moving up - increase position of columns in between
        await tx.column.updateMany({
          where: {
            boardId,
            position: {
              gte: newPosition,
              lt: oldPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      // Update the current column's position
      await tx.column.update({
        where: { id },
        data: { position: newPosition },
      });
    });

    // Return updated column
    return await this.getColumnById(id);
  }

  // Get next position for new column
  async getNextPosition(boardId: string): Promise<number> {
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
    });
    return lastColumn ? lastColumn.position + 1 : 0;
  }

  // Check if column exists
  async columnExists(id: string): Promise<boolean> {
    const column = await prisma.column.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!column;
  }

  // Check if column belongs to board
  async columnBelongsToBoard(
    columnId: string,
    boardId: string
  ): Promise<boolean> {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      select: { boardId: true },
    });
    return column?.boardId === boardId;
  }
}

export const columnService = new ColumnService();
