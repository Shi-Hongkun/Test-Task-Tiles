"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Shared Types', () => {
    (0, vitest_1.describe)('Board Type', () => {
        (0, vitest_1.it)('should have correct structure', () => {
            const board = {
                id: 'test-id',
                name: 'Test Board',
                description: 'Test Description',
                createdAt: new Date(),
                updatedAt: new Date(),
                columns: []
            };
            (0, vitest_1.expect)(board.id).toBe('test-id');
            (0, vitest_1.expect)(board.name).toBe('Test Board');
            (0, vitest_1.expect)(board.description).toBe('Test Description');
            (0, vitest_1.expect)(board.createdAt).toBeInstanceOf(Date);
            (0, vitest_1.expect)(board.updatedAt).toBeInstanceOf(Date);
            (0, vitest_1.expect)(Array.isArray(board.columns)).toBe(true);
        });
    });
    (0, vitest_1.describe)('Column Type', () => {
        (0, vitest_1.it)('should have correct structure', () => {
            const column = {
                id: 'column-id',
                name: 'To Do',
                position: 0,
                boardId: 'board-id',
                createdAt: new Date(),
                tasks: []
            };
            (0, vitest_1.expect)(column.id).toBe('column-id');
            (0, vitest_1.expect)(column.name).toBe('To Do');
            (0, vitest_1.expect)(column.position).toBe(0);
            (0, vitest_1.expect)(column.boardId).toBe('board-id');
            (0, vitest_1.expect)(column.createdAt).toBeInstanceOf(Date);
            (0, vitest_1.expect)(Array.isArray(column.tasks)).toBe(true);
        });
    });
    (0, vitest_1.describe)('Task Type', () => {
        (0, vitest_1.it)('should have correct structure', () => {
            const task = {
                id: 'task-id',
                title: 'Test Task',
                description: 'Test Description',
                position: 0,
                columnId: 'column-id',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            (0, vitest_1.expect)(task.id).toBe('task-id');
            (0, vitest_1.expect)(task.title).toBe('Test Task');
            (0, vitest_1.expect)(task.description).toBe('Test Description');
            (0, vitest_1.expect)(task.position).toBe(0);
            (0, vitest_1.expect)(task.columnId).toBe('column-id');
            (0, vitest_1.expect)(task.createdAt).toBeInstanceOf(Date);
            (0, vitest_1.expect)(task.updatedAt).toBeInstanceOf(Date);
        });
    });
    (0, vitest_1.describe)('DTO Types', () => {
        (0, vitest_1.it)('should validate CreateBoardDto', () => {
            const dto = {
                name: 'New Board',
                description: 'Optional description'
            };
            (0, vitest_1.expect)(dto.name).toBe('New Board');
            (0, vitest_1.expect)(dto.description).toBe('Optional description');
        });
        (0, vitest_1.it)('should validate CreateColumnDto', () => {
            const dto = {
                name: 'New Column',
                position: 1,
                boardId: 'board-id'
            };
            (0, vitest_1.expect)(dto.name).toBe('New Column');
            (0, vitest_1.expect)(dto.position).toBe(1);
            (0, vitest_1.expect)(dto.boardId).toBe('board-id');
        });
        (0, vitest_1.it)('should validate CreateTaskDto', () => {
            const dto = {
                title: 'New Task',
                description: 'Task description',
                position: 0,
                columnId: 'column-id'
            };
            (0, vitest_1.expect)(dto.title).toBe('New Task');
            (0, vitest_1.expect)(dto.description).toBe('Task description');
            (0, vitest_1.expect)(dto.position).toBe(0);
            (0, vitest_1.expect)(dto.columnId).toBe('column-id');
        });
    });
    (0, vitest_1.describe)('ApiResponse Type', () => {
        (0, vitest_1.it)('should handle successful response', () => {
            const response = {
                success: true,
                data: {
                    id: 'board-id',
                    name: 'Test Board',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            };
            (0, vitest_1.expect)(response.success).toBe(true);
            (0, vitest_1.expect)(response.data).toBeDefined();
            (0, vitest_1.expect)(response.data?.id).toBe('board-id');
        });
        (0, vitest_1.it)('should handle error response', () => {
            const response = {
                success: false,
                error: 'Something went wrong',
                message: 'Error message'
            };
            (0, vitest_1.expect)(response.success).toBe(false);
            (0, vitest_1.expect)(response.error).toBe('Something went wrong');
            (0, vitest_1.expect)(response.message).toBe('Error message');
        });
    });
});
//# sourceMappingURL=types.test.js.map