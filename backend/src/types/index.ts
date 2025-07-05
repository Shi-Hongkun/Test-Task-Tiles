// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Board Types
export interface BoardDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBoardRequest {
  name: string;
  description?: string;
}

export interface UpdateBoardRequest {
  name?: string;
  description?: string;
}

// Column Types
export interface ColumnDto {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: Date;
  tasks?: TaskDto[];
}

export interface CreateColumnRequest {
  name: string;
  position: number;
  boardId: string;
}

export interface UpdateColumnRequest {
  name?: string;
  position?: number;
}

// Task Types
export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  position: number;
  columnId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  position?: number;
  columnId?: string;
}

// Board with Relations
export interface BoardWithColumns extends BoardDto {
  columns: ColumnDto[];
}

export interface BoardWithFullData extends BoardDto {
  columns: (ColumnDto & { tasks: TaskDto[] })[];
}

// Position Update Types
export interface UpdateTaskPositionRequest {
  id: string;
  columnId: string;
  position: number;
}

export interface UpdateColumnPositionRequest {
  id: string;
  position: number;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
}
