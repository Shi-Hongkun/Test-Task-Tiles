import { describe, it, expect } from 'vitest'
import type { 
  Board, 
  Column, 
  Task, 
  CreateBoardDto, 
  CreateColumnDto, 
  CreateTaskDto,
  ApiResponse 
} from '../types'

describe('Shared Types', () => {
  describe('Board Type', () => {
    it('should have correct structure', () => {
      const board: Board = {
        id: 'test-id',
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        columns: []
      }
      
      expect(board.id).toBe('test-id')
      expect(board.name).toBe('Test Board')
      expect(board.description).toBe('Test Description')
      expect(board.createdAt).toBeInstanceOf(Date)
      expect(board.updatedAt).toBeInstanceOf(Date)
      expect(Array.isArray(board.columns)).toBe(true)
    })
  })
  
  describe('Column Type', () => {
    it('should have correct structure', () => {
      const column: Column = {
        id: 'column-id',
        name: 'To Do',
        position: 0,
        boardId: 'board-id',
        createdAt: new Date(),
        tasks: []
      }
      
      expect(column.id).toBe('column-id')
      expect(column.name).toBe('To Do')
      expect(column.position).toBe(0)
      expect(column.boardId).toBe('board-id')
      expect(column.createdAt).toBeInstanceOf(Date)
      expect(Array.isArray(column.tasks)).toBe(true)
    })
  })
  
  describe('Task Type', () => {
    it('should have correct structure', () => {
      const task: Task = {
        id: 'task-id',
        title: 'Test Task',
        description: 'Test Description',
        position: 0,
        columnId: 'column-id',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      expect(task.id).toBe('task-id')
      expect(task.title).toBe('Test Task')
      expect(task.description).toBe('Test Description')
      expect(task.position).toBe(0)
      expect(task.columnId).toBe('column-id')
      expect(task.createdAt).toBeInstanceOf(Date)
      expect(task.updatedAt).toBeInstanceOf(Date)
    })
  })
  
  describe('DTO Types', () => {
    it('should validate CreateBoardDto', () => {
      const dto: CreateBoardDto = {
        name: 'New Board',
        description: 'Optional description'
      }
      
      expect(dto.name).toBe('New Board')
      expect(dto.description).toBe('Optional description')
    })
    
    it('should validate CreateColumnDto', () => {
      const dto: CreateColumnDto = {
        name: 'New Column',
        position: 1,
        boardId: 'board-id'
      }
      
      expect(dto.name).toBe('New Column')
      expect(dto.position).toBe(1)
      expect(dto.boardId).toBe('board-id')
    })
    
    it('should validate CreateTaskDto', () => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        position: 0,
        columnId: 'column-id'
      }
      
      expect(dto.title).toBe('New Task')
      expect(dto.description).toBe('Task description')
      expect(dto.position).toBe(0)
      expect(dto.columnId).toBe('column-id')
    })
  })
  
  describe('ApiResponse Type', () => {
    it('should handle successful response', () => {
      const response: ApiResponse<Board> = {
        success: true,
        data: {
          id: 'board-id',
          name: 'Test Board',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      
      expect(response.success).toBe(true)
      expect(response.data).toBeDefined()
      expect(response.data?.id).toBe('board-id')
    })
    
    it('should handle error response', () => {
      const response: ApiResponse = {
        success: false,
        error: 'Something went wrong',
        message: 'Error message'
      }
      
      expect(response.success).toBe(false)
      expect(response.error).toBe('Something went wrong')
      expect(response.message).toBe('Error message')
    })
  })
}) 