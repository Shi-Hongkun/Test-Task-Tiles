import { prisma } from '../utils/database';
import {
  TaskDto,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskPositionRequest,
} from '../types';

export class TaskService {
  // Helper function to convert Prisma Task to TaskDto
  private convertTaskToDto(task: any): TaskDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      position: task.position,
      columnId: task.columnId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  // Get all tasks for a column
  async getTasksByColumnId(columnId: string): Promise<TaskDto[]> {
    const tasks = await prisma.task.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
    });
    return tasks.map((task) => this.convertTaskToDto(task));
  }

  // Get task by ID
  async getTaskById(id: string): Promise<TaskDto | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });
    return task ? this.convertTaskToDto(task) : null;
  }

  // Create new task
  async createTask(data: CreateTaskRequest): Promise<TaskDto> {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        position: data.position,
        columnId: data.columnId,
      },
    });
    return this.convertTaskToDto(task);
  }

  // Update task
  async updateTask(
    id: string,
    data: UpdateTaskRequest
  ): Promise<TaskDto | null> {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        position: data.position,
        columnId: data.columnId,
      },
    });
    return this.convertTaskToDto(task);
  }

  // Delete task
  async deleteTask(id: string): Promise<boolean> {
    await prisma.task.delete({
      where: { id },
    });
    return true;
  }

  // Update task position (including moving between columns)
  async updateTaskPosition(
    id: string,
    newColumnId: string,
    newPosition: number
  ): Promise<TaskDto | null> {
    // Get current task
    const currentTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!currentTask) {
      return null;
    }

    const oldColumnId = currentTask.columnId;
    const oldPosition = currentTask.position;

    // Use transaction to update positions
    await prisma.$transaction(async (tx) => {
      if (oldColumnId === newColumnId) {
        // Moving within the same column
        if (newPosition > oldPosition) {
          // Moving down - decrease position of tasks in between
          await tx.task.updateMany({
            where: {
              columnId: newColumnId,
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
          // Moving up - increase position of tasks in between
          await tx.task.updateMany({
            where: {
              columnId: newColumnId,
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
      } else {
        // Moving between columns
        // Decrease position of tasks after old position in old column
        await tx.task.updateMany({
          where: {
            columnId: oldColumnId,
            position: {
              gt: oldPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        // Increase position of tasks at and after new position in new column
        await tx.task.updateMany({
          where: {
            columnId: newColumnId,
            position: {
              gte: newPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      // Update the current task's position and column
      await tx.task.update({
        where: { id },
        data: {
          position: newPosition,
          columnId: newColumnId,
        },
      });
    });

    // Return updated task
    return await this.getTaskById(id);
  }

  // Get next position for new task
  async getNextPosition(columnId: string): Promise<number> {
    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { position: 'desc' },
    });
    return lastTask ? lastTask.position + 1 : 0;
  }

  // Check if task exists
  async taskExists(id: string): Promise<boolean> {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!task;
  }

  // Check if task belongs to column
  async taskBelongsToColumn(
    taskId: string,
    columnId: string
  ): Promise<boolean> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { columnId: true },
    });
    return task?.columnId === columnId;
  }
}

export const taskService = new TaskService();
