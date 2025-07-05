import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import apiRoutes from '../routes';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler';
import { prisma } from '../utils/database';

// Create test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);
app.use(errorHandler);
app.use('*', notFoundHandler);

describe('Task Tiles API', () => {
  let testBoardId: string;
  let testColumnId: string;
  let testTaskId: string;

  beforeAll(async () => {
    // Connect to test database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.task.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up data before each test
    await prisma.task.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();
  });

  describe('Board API', () => {
    describe('POST /api/boards', () => {
      it('should create a new board with default columns', async () => {
        const boardData = {
          name: 'Test Board',
          description: 'Test board description',
        };

        const response = await request(app)
          .post('/api/boards')
          .send(boardData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(boardData.name);
        expect(response.body.data.description).toBe(boardData.description);
        expect(response.body.data.id).toBeDefined();

        testBoardId = response.body.data.id;
      });

      it('should return error when name is missing', async () => {
        const response = await request(app)
          .post('/api/boards')
          .send({ description: 'Test' })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Board name is required');
      });
    });

    describe('GET /api/boards', () => {
      it('should return all boards', async () => {
        // Create test board
        await prisma.board.create({
          data: {
            name: 'Test Board',
            description: 'Test description',
          },
        });

        const response = await request(app).get('/api/boards').expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].name).toBe('Test Board');
      });

      it('should return empty array when no boards exist', async () => {
        const response = await request(app).get('/api/boards').expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });
    });

    describe('GET /api/boards/:id', () => {
      it('should return a specific board', async () => {
        const board = await prisma.board.create({
          data: {
            name: 'Test Board',
            description: 'Test description',
          },
        });

        const response = await request(app)
          .get(`/api/boards/${board.id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(board.id);
        expect(response.body.data.name).toBe('Test Board');
      });

      it('should return 404 for non-existent board', async () => {
        const response = await request(app)
          .get('/api/boards/non-existent-id')
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Board not found');
      });
    });

    describe('PUT /api/boards/:id', () => {
      it('should update board name and description', async () => {
        const board = await prisma.board.create({
          data: {
            name: 'Original Name',
            description: 'Original description',
          },
        });

        const updateData = {
          name: 'Updated Name',
          description: 'Updated description',
        };

        const response = await request(app)
          .put(`/api/boards/${board.id}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Updated Name');
        expect(response.body.data.description).toBe('Updated description');
      });
    });

    describe('DELETE /api/boards/:id', () => {
      it('should delete board and its related data', async () => {
        const board = await prisma.board.create({
          data: {
            name: 'Test Board',
            columns: {
              create: [
                {
                  name: 'To Do',
                  position: 0,
                  tasks: {
                    create: [{ title: 'Test Task', position: 0 }],
                  },
                },
              ],
            },
          },
        });

        const response = await request(app)
          .delete(`/api/boards/${board.id}`)
          .expect(200);

        expect(response.body.success).toBe(true);

        // Verify cascading delete
        const deletedBoard = await prisma.board.findUnique({
          where: { id: board.id },
        });
        expect(deletedBoard).toBeNull();
      });
    });
  });

  describe('Column API', () => {
    beforeEach(async () => {
      // Create test board
      const board = await prisma.board.create({
        data: {
          name: 'Test Board',
          description: 'Test description',
        },
      });
      testBoardId = board.id;
    });

    describe('POST /api/columns', () => {
      it('should create a new column', async () => {
        const columnData = {
          name: 'Test Column',
          position: 0,
          boardId: testBoardId,
        };

        const response = await request(app)
          .post('/api/columns')
          .send(columnData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Test Column');
        expect(response.body.data.position).toBe(0);
        expect(response.body.data.boardId).toBe(testBoardId);

        testColumnId = response.body.data.id;
      });

      it('should return error when boardId is invalid', async () => {
        const columnData = {
          name: 'Test Column',
          position: 0,
          boardId: 'invalid-board-id',
        };

        const response = await request(app)
          .post('/api/columns')
          .send(columnData)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Board not found');
      });
    });

    describe('GET /api/boards/:boardId/columns', () => {
      it('should return all columns for a board', async () => {
        await prisma.column.createMany({
          data: [
            { name: 'To Do', position: 0, boardId: testBoardId },
            { name: 'In Progress', position: 1, boardId: testBoardId },
            { name: 'Done', position: 2, boardId: testBoardId },
          ],
        });

        const response = await request(app)
          .get(`/api/boards/${testBoardId}/columns`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(3);
        expect(response.body.data[0].name).toBe('To Do');
        expect(response.body.data[1].name).toBe('In Progress');
        expect(response.body.data[2].name).toBe('Done');
      });
    });
  });

  describe('Task API', () => {
    beforeEach(async () => {
      // Create test board and column
      const board = await prisma.board.create({
        data: {
          name: 'Test Board',
          columns: {
            create: {
              name: 'Test Column',
              position: 0,
            },
          },
        },
        include: {
          columns: true,
        },
      });
      testBoardId = board.id;
      testColumnId = board.columns[0].id;
    });

    describe('POST /api/tasks', () => {
      it('should create a new task', async () => {
        const taskData = {
          title: 'Test Task',
          description: 'Test task description',
          position: 0,
          columnId: testColumnId,
        };

        const response = await request(app)
          .post('/api/tasks')
          .send(taskData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe('Test Task');
        expect(response.body.data.description).toBe('Test task description');
        expect(response.body.data.position).toBe(0);
        expect(response.body.data.columnId).toBe(testColumnId);

        testTaskId = response.body.data.id;
      });

      it('should return error when columnId is invalid', async () => {
        const taskData = {
          title: 'Test Task',
          position: 0,
          columnId: 'invalid-column-id',
        };

        const response = await request(app)
          .post('/api/tasks')
          .send(taskData)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Column not found');
      });
    });

    describe('GET /api/columns/:columnId/tasks', () => {
      it('should return all tasks for a column', async () => {
        await prisma.task.createMany({
          data: [
            { title: 'Task 1', position: 0, columnId: testColumnId },
            { title: 'Task 2', position: 1, columnId: testColumnId },
          ],
        });

        const response = await request(app)
          .get(`/api/columns/${testColumnId}/tasks`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0].title).toBe('Task 1');
        expect(response.body.data[1].title).toBe('Task 2');
      });
    });

    describe('PUT /api/tasks/:id/position', () => {
      it('should update task position within same column', async () => {
        const task = await prisma.task.create({
          data: {
            title: 'Test Task',
            position: 0,
            columnId: testColumnId,
          },
        });

        const response = await request(app)
          .put(`/api/tasks/${task.id}/position`)
          .send({ columnId: testColumnId, position: 1 })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.position).toBe(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/boards')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
