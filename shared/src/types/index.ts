// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Enum types
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ItemType {
  TASK = 'TASK',
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  ENHANCEMENT = 'ENHANCEMENT',
  PRODUCT_A = 'PRODUCT_A',
  PRODUCT_B = 'PRODUCT_B',
}

export enum EstimateSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

// Domain Types
export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  columns?: Column[];
}

export interface Column {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: Date;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;

  // Enhanced fields
  projectNumber?: string;
  assignee?: string;
  assigner?: string;
  priority?: Priority;
  itemType?: ItemType;
  initiative?: string;
  estimateSize?: EstimateSize;
  startDate?: Date;
  deadline?: Date;
  tags?: string[];

  createdAt: Date;
  updatedAt: Date;
}

// Helper types
export interface ColumnWithTasks extends Column {
  tasks: Task[];
}

// Form Data Types
export interface BoardFormData {
  name: string;
  description?: string;
}

export interface ColumnFormData {
  name: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  projectNumber?: string;
  assignee?: string;
  assigner?: string;
  priority?: Priority;
  itemType?: ItemType;
  initiative?: string;
  estimateSize?: EstimateSize;
  startDate?: string;
  deadline?: string;
  tags?: string[];
}

// Request/Response DTOs
export interface CreateBoardDto {
  name: string;
  description?: string;
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
}

export interface CreateColumnDto {
  name: string;
  position: number;
  boardId: string;
}

export interface UpdateColumnDto {
  name?: string;
  position?: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  position: number;
  columnId: string;
  projectNumber?: string;
  assignee?: string;
  assigner?: string;
  priority?: Priority;
  itemType?: ItemType;
  initiative?: string;
  estimateSize?: EstimateSize;
  startDate?: Date;
  deadline?: Date;
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  position?: number;
  columnId?: string;
  projectNumber?: string;
  assignee?: string;
  assigner?: string;
  priority?: Priority;
  itemType?: ItemType;
  initiative?: string;
  estimateSize?: EstimateSize;
  startDate?: Date;
  deadline?: Date;
  tags?: string[];
}

export interface MoveTaskDto {
  taskId: string;
  columnId: string;
  position: number;
}

// Drag and Drop Types
export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current: Task;
    };
  };
  over: {
    id: string;
    data: {
      current: Column;
    };
  } | null;
}
