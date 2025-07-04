// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
  createdAt: Date;
  updatedAt: Date;
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
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  position?: number;
  columnId?: string;
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