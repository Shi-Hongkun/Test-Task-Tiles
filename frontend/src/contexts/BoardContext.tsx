import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import {
  BoardContextValue,
  Board,
  BoardWithFullData,
  LoadingState,
  ErrorState,
  CreateBoardRequest,
  UpdateBoardRequest,
  CreateColumnRequest,
  UpdateColumnRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  Column,
  Task,
} from '../types';
import {
  boardService,
  columnService,
  taskService,
  ApiError,
} from '../services';

// Initial states
const initialLoadingState: LoadingState = {
  boards: false,
  board: false,
  columns: false,
  tasks: false,
  creating: false,
  updating: false,
  deleting: false,
};

const initialErrorState: ErrorState = {
  boards: null,
  board: null,
  columns: null,
  tasks: null,
  creating: null,
  updating: null,
  deleting: null,
};

// State interface
interface BoardState {
  boards: Board[];
  currentBoard: BoardWithFullData | null;
  loading: LoadingState;
  errors: ErrorState;
}

// Action types
type BoardAction =
  | {
      type: 'SET_LOADING';
      payload: { key: keyof LoadingState; value: boolean };
    }
  | {
      type: 'SET_ERROR';
      payload: { key: keyof ErrorState; value: string | null };
    }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_BOARDS'; payload: Board[] }
  | { type: 'SET_CURRENT_BOARD'; payload: BoardWithFullData | null }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'REMOVE_BOARD'; payload: string }
  | { type: 'ADD_COLUMN'; payload: Column }
  | { type: 'UPDATE_COLUMN'; payload: Column }
  | { type: 'REMOVE_COLUMN'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | {
      type: 'OPTIMISTIC_UPDATE_TASK';
      payload: { taskId: string; columnId: string; position: number };
    }
  | { type: 'REMOVE_TASK'; payload: string };

// Reducer
const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
      };

    case 'CLEAR_ERRORS':
      return { ...state, errors: initialErrorState };

    case 'SET_BOARDS':
      return { ...state, boards: action.payload };

    case 'SET_CURRENT_BOARD':
      return { ...state, currentBoard: action.payload };

    case 'ADD_BOARD':
      return { ...state, boards: [...state.boards, action.payload] };

    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board
        ),
        currentBoard:
          state.currentBoard?.id === action.payload.id
            ? { ...state.currentBoard, ...action.payload }
            : state.currentBoard,
      };

    case 'REMOVE_BOARD':
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
        currentBoard:
          state.currentBoard?.id === action.payload ? null : state.currentBoard,
      };

    case 'ADD_COLUMN':
      if (!state.currentBoard) return state;
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: [
            ...state.currentBoard.columns,
            { ...action.payload, tasks: [] },
          ],
        },
      };

    case 'UPDATE_COLUMN':
      if (!state.currentBoard) return state;
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column) =>
            column.id === action.payload.id
              ? { ...column, ...action.payload }
              : column
          ),
        },
      };

    case 'REMOVE_COLUMN':
      if (!state.currentBoard) return state;
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.filter(
            (column) => column.id !== action.payload
          ),
        },
      };

    case 'ADD_TASK':
      if (!state.currentBoard) return state;
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column) =>
            column.id === action.payload.columnId
              ? { ...column, tasks: [...column.tasks, action.payload] }
              : column
          ),
        },
      };

    case 'OPTIMISTIC_UPDATE_TASK':
      if (!state.currentBoard) return state;

      const { taskId, columnId, position } = action.payload;

      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column) => {
            // Find and remove the task from all columns
            const tasksWithoutTarget = column.tasks.filter(
              (task) => task.id !== taskId
            );

            // If this is the target column, add the task at the new position
            if (column.id === columnId) {
              // Find the task from the original column to maintain its data
              const targetTask = state
                .currentBoard!.columns.flatMap((col) => col.tasks)
                .find((task) => task.id === taskId);

              if (targetTask) {
                // Create updated task with new column and position
                const updatedTask = {
                  ...targetTask,
                  columnId,
                  position,
                  updatedAt: new Date().toISOString(), // Optimistic timestamp
                };

                // Insert task at correct position
                const tasksWithNew = [...tasksWithoutTarget, updatedTask];
                tasksWithNew.sort((a, b) => a.position - b.position);

                return {
                  ...column,
                  tasks: tasksWithNew,
                };
              }
            }

            // For other columns, just return tasks without the moved task
            return {
              ...column,
              tasks: tasksWithoutTarget,
            };
          }),
        },
      };

    case 'UPDATE_TASK':
      if (!state.currentBoard) return state;

      const updatedTask = action.payload;

      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column) => {
            // Remove the task from all columns first
            const tasksWithoutUpdatedTask = column.tasks.filter(
              (task) => task.id !== updatedTask.id
            );

            // If this is the target column, add the updated task
            if (column.id === updatedTask.columnId) {
              // Sort all tasks including the updated one by position
              const allTasks = [...tasksWithoutUpdatedTask, updatedTask];
              allTasks.sort((a, b) => a.position - b.position);
              return {
                ...column,
                tasks: allTasks,
              };
            }

            // For other columns, just return tasks without the updated task
            return {
              ...column,
              tasks: tasksWithoutUpdatedTask,
            };
          }),
        },
      };

    case 'REMOVE_TASK':
      if (!state.currentBoard) return state;
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== action.payload),
          })),
        },
      };

    default:
      return state;
  }
};

// Initial state
const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: initialLoadingState,
  errors: initialErrorState,
};

// Context
const BoardContext = createContext<BoardContextValue | undefined>(undefined);

// Provider component
export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // Utility functions
  const setLoading = useCallback((key: keyof LoadingState, value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  }, []);

  const setError = useCallback(
    (key: keyof ErrorState, value: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: { key, value } });
    },
    []
  );

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const handleApiError = useCallback(
    (error: any, errorKey: keyof ErrorState) => {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
      setError(errorKey, message);
      console.error(`API Error (${errorKey}):`, error);
    },
    [setError]
  );

  // Board actions
  const fetchBoards = useCallback(
    async (userId?: string) => {
      setLoading('boards', true);
      setError('boards', null);
      try {
        const boards = await boardService.getAllBoards(userId);
        dispatch({ type: 'SET_BOARDS', payload: boards });
      } catch (error) {
        handleApiError(error, 'boards');
      } finally {
        setLoading('boards', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const fetchBoard = useCallback(
    async (id: string) => {
      setLoading('board', true);
      setError('board', null);
      try {
        const board = await boardService.getBoardWithFullData(id);
        dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
      } catch (error) {
        handleApiError(error, 'board');
      } finally {
        setLoading('board', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const createBoard = useCallback(
    async (data: CreateBoardRequest): Promise<Board | null> => {
      setLoading('creating', true);
      setError('creating', null);
      try {
        const board = await boardService.createBoard(data);
        dispatch({ type: 'ADD_BOARD', payload: board });
        return board;
      } catch (error) {
        handleApiError(error, 'creating');
        return null;
      } finally {
        setLoading('creating', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const updateBoard = useCallback(
    async (id: string, data: UpdateBoardRequest): Promise<Board | null> => {
      setLoading('updating', true);
      setError('updating', null);
      try {
        const board = await boardService.updateBoard(id, data);
        dispatch({ type: 'UPDATE_BOARD', payload: board });
        return board;
      } catch (error) {
        handleApiError(error, 'updating');
        return null;
      } finally {
        setLoading('updating', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const deleteBoard = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading('deleting', true);
      setError('deleting', null);
      try {
        await boardService.deleteBoard(id);
        dispatch({ type: 'REMOVE_BOARD', payload: id });
        return true;
      } catch (error) {
        handleApiError(error, 'deleting');
        return false;
      } finally {
        setLoading('deleting', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  // Column actions
  const createColumn = useCallback(
    async (data: CreateColumnRequest): Promise<Column | null> => {
      setLoading('creating', true);
      setError('creating', null);
      try {
        const column = await columnService.createColumn(data);
        dispatch({ type: 'ADD_COLUMN', payload: column });
        return column;
      } catch (error) {
        handleApiError(error, 'creating');
        return null;
      } finally {
        setLoading('creating', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const updateColumn = useCallback(
    async (id: string, data: UpdateColumnRequest): Promise<Column | null> => {
      setLoading('updating', true);
      setError('updating', null);
      try {
        const column = await columnService.updateColumn(id, data);
        dispatch({ type: 'UPDATE_COLUMN', payload: column });
        return column;
      } catch (error) {
        handleApiError(error, 'updating');
        return null;
      } finally {
        setLoading('updating', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const updateColumnPosition = useCallback(
    async (id: string, position: number): Promise<Column | null> => {
      setLoading('updating', true);
      setError('updating', null);
      try {
        const column = await columnService.updateColumnPosition(id, position);
        // Refresh board to get updated positions
        if (state.currentBoard) {
          await fetchBoard(state.currentBoard.id);
        }
        return column;
      } catch (error) {
        handleApiError(error, 'updating');
        return null;
      } finally {
        setLoading('updating', false);
      }
    },
    [setLoading, setError, handleApiError, state.currentBoard, fetchBoard]
  );

  const deleteColumn = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading('deleting', true);
      setError('deleting', null);
      try {
        await columnService.deleteColumn(id);
        dispatch({ type: 'REMOVE_COLUMN', payload: id });
        return true;
      } catch (error) {
        handleApiError(error, 'deleting');
        return false;
      } finally {
        setLoading('deleting', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  // Task actions
  const createTask = useCallback(
    async (data: CreateTaskRequest): Promise<Task | null> => {
      setLoading('creating', true);
      setError('creating', null);
      try {
        const task = await taskService.createTask(data);
        dispatch({ type: 'ADD_TASK', payload: task });
        return task;
      } catch (error) {
        handleApiError(error, 'creating');
        return null;
      } finally {
        setLoading('creating', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const updateTask = useCallback(
    async (id: string, data: UpdateTaskRequest): Promise<Task | null> => {
      setLoading('updating', true);
      setError('updating', null);
      try {
        const task = await taskService.updateTask(id, data);
        dispatch({ type: 'UPDATE_TASK', payload: task });
        return task;
      } catch (error) {
        handleApiError(error, 'updating');
        return null;
      } finally {
        setLoading('updating', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  // Optimistic update method
  const optimisticUpdateTaskPosition = useCallback(
    (taskId: string, columnId: string, position: number) => {
      dispatch({
        type: 'OPTIMISTIC_UPDATE_TASK',
        payload: { taskId, columnId, position },
      });
    },
    []
  );

  const updateTaskPosition = useCallback(
    async (
      id: string,
      columnId: string,
      position: number
    ): Promise<Task | null> => {
      // Store original state for potential rollback
      const originalBoard = state.currentBoard;

      // First, perform optimistic update for immediate UI feedback
      optimisticUpdateTaskPosition(id, columnId, position);

      setLoading('updating', true);
      setError('updating', null);
      try {
        const task = await taskService.updateTaskPosition(
          id,
          columnId,
          position
        );
        // Replace optimistic update with actual server response
        dispatch({ type: 'UPDATE_TASK', payload: task });
        return task;
      } catch (error) {
        // Rollback optimistic update on error
        if (originalBoard) {
          dispatch({ type: 'SET_CURRENT_BOARD', payload: originalBoard });
        }
        handleApiError(error, 'updating');
        return null;
      } finally {
        setLoading('updating', false);
      }
    },
    [
      setLoading,
      setError,
      handleApiError,
      optimisticUpdateTaskPosition,
      state.currentBoard,
    ]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading('deleting', true);
      setError('deleting', null);
      try {
        await taskService.deleteTask(id);
        dispatch({ type: 'REMOVE_TASK', payload: id });
        return true;
      } catch (error) {
        handleApiError(error, 'deleting');
        return false;
      } finally {
        setLoading('deleting', false);
      }
    },
    [setLoading, setError, handleApiError]
  );

  const value: BoardContextValue = {
    // Data
    boards: state.boards,
    currentBoard: state.currentBoard,

    // Loading states
    loading: state.loading,

    // Error states
    errors: state.errors,

    // Actions
    fetchBoards,
    fetchBoard,
    createBoard,
    updateBoard,
    deleteBoard,

    createColumn,
    updateColumn,
    updateColumnPosition,
    deleteColumn,

    createTask,
    updateTask,
    updateTaskPosition,
    deleteTask,

    // Utility functions
    clearErrors,
    setLoading,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

// Hook to use the context
export const useBoardContext = (): BoardContextValue => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};
