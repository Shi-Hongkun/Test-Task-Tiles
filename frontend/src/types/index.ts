// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Board Types
export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardWithColumns extends Board {
  columns: Column[];
}

export interface BoardWithFullData extends Board {
  columns: ColumnWithTasks[];
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
export interface Column {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string;
}

export interface ColumnWithTasks extends Column {
  tasks: Task[];
}

export interface CreateColumnRequest {
  name: string;
  position?: number;
  boardId: string;
}

export interface UpdateColumnRequest {
  name?: string;
  position?: number;
}

// Enum Types
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

// Task Types
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
  deadline?: string;
  tags?: string[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  position?: number;
  columnId: string;

  // Enhanced fields
  projectNumber?: string;
  assignee?: string;
  assigner?: string;
  priority?: Priority;
  itemType?: ItemType;
  initiative?: string;
  estimateSize?: EstimateSize;
  deadline?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  position?: number;
  columnId?: string;

  // Enhanced fields
  projectNumber?: string;
  assignee?: string;
  assigner?: string;
  priority?: Priority;
  itemType?: ItemType;
  initiative?: string;
  estimateSize?: EstimateSize;
  deadline?: string;
  tags?: string[];
}

// Drag & Drop Types
export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current: {
        type: 'task' | 'column';
        task?: Task;
        column?: Column;
      };
    };
  };
  over: {
    id: string;
    data: {
      current: {
        type: 'task' | 'column' | 'droppable';
        accepts?: string[];
        column?: Column;
      };
    };
  } | null;
}

// UI State Types
export interface LoadingState {
  boards: boolean;
  board: boolean;
  columns: boolean;
  tasks: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export interface ErrorState {
  boards: string | null;
  board: string | null;
  columns: string | null;
  tasks: string | null;
  creating: string | null;
  updating: string | null;
  deleting: string | null;
}

// Form Types
export interface BoardFormData {
  name: string;
  description: string;
}

export interface ColumnFormData {
  name: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  projectNumber?: string;
  assignee?: string;
  assigner?: string;
  priority?: Priority;
  itemType?: ItemType;
  initiative?: string;
  estimateSize?: EstimateSize;
  deadline?: string;
  tags?: string[];
}

// Modal Types
export interface ModalState {
  createBoard: boolean;
  editBoard: boolean;
  deleteBoard: boolean;
  createColumn: boolean;
  editColumn: boolean;
  deleteColumn: boolean;
  createTask: boolean;
  editTask: boolean;
  deleteTask: boolean;
}

// Context Types
export interface BoardContextValue {
  // Data
  boards: Board[];
  currentBoard: BoardWithFullData | null;

  // Loading states
  loading: LoadingState;

  // Error states
  errors: ErrorState;

  // Actions
  fetchBoards: () => Promise<void>;
  fetchBoard: (id: string) => Promise<void>;
  createBoard: (data: CreateBoardRequest) => Promise<Board | null>;
  updateBoard: (id: string, data: UpdateBoardRequest) => Promise<Board | null>;
  deleteBoard: (id: string) => Promise<boolean>;

  createColumn: (data: CreateColumnRequest) => Promise<Column | null>;
  updateColumn: (
    id: string,
    data: UpdateColumnRequest
  ) => Promise<Column | null>;
  updateColumnPosition: (
    id: string,
    position: number
  ) => Promise<Column | null>;
  deleteColumn: (id: string) => Promise<boolean>;

  createTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<Task | null>;
  updateTaskPosition: (
    id: string,
    columnId: string,
    position: number
  ) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;

  // Utility functions
  clearErrors: () => void;
  setLoading: (key: keyof LoadingState, value: boolean) => void;
}
