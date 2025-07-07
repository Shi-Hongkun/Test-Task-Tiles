import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Plus } from 'lucide-react';
import { useBoardContext } from '../contexts/BoardContext';
// import { useViewContext } from '../contexts/ViewContext';
import {
  Task,
  ColumnWithTasks,
  TaskFormData,
  ColumnFormData,
  ViewType,
} from '../types';
import { BoardView } from '../components/BoardView';
import { ViewSwitcher, ViewInfo } from '../components/ViewSwitcher';
import { TaskForm, ColumnForm } from '../components/forms';

// Import placeholder components (will be implemented next)
const ListView = React.lazy(() => import('../components/views/ListView'));
const CalendarView = React.lazy(
  () => import('../components/views/CalendarView')
);
const TimelineView = React.lazy(
  () => import('../components/views/TimelineView')
);

// Main board content component
const BoardPageContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Temporarily remove ViewContext usage
  const {
    currentBoard,
    loading,
    fetchBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
  } = useBoardContext();

  // 简化的状态管理，移除可能导致循环的逻辑
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

  // Modal states
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showEditColumn, setShowEditColumn] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);

  // Current editing items
  const [currentColumn, setCurrentColumn] = useState<ColumnWithTasks | null>(
    null
  );
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentTaskColumnId, setCurrentTaskColumnId] = useState<string>('');

  // 简化的数据获取逻辑
  useEffect(() => {
    if (id && id !== currentBoardId) {
      console.log('📥 Fetching board with id:', id);
      setCurrentBoardId(id);
      fetchBoard(id);
    }
  }, [id, currentBoardId]); // 使用更简单的依赖管理

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Board ID Missing
          </h1>
          <p className="text-gray-600">Invalid board URL</p>
        </div>
      </div>
    );
  }

  // Column handlers
  const handleCreateColumn = () => {
    setShowCreateColumn(true);
  };

  const handleEditColumn = (column: ColumnWithTasks) => {
    setCurrentColumn(column);
    setShowEditColumn(true);
  };

  const handleDeleteColumn = async (columnId: string) => {
    await deleteColumn(columnId);
  };

  // Task handlers
  const handleCreateTask = (columnId: string) => {
    setCurrentTaskColumnId(columnId);
    setShowCreateTask(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setShowEditTask(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  // Form submit handlers
  const handleCreateColumnSubmit = async (formData: ColumnFormData) => {
    if (currentBoard) {
      const createColumnData = {
        name: formData.name,
        boardId: currentBoard.id,
      };
      await createColumn(createColumnData);
    }
  };

  const handleUpdateColumnSubmit = async (formData: ColumnFormData) => {
    if (currentColumn) {
      const updateColumnData = {
        name: formData.name,
      };
      await updateColumn(currentColumn.id, updateColumnData);
    }
  };

  const handleCreateTaskSubmit = async (formData: TaskFormData) => {
    if (currentTaskColumnId) {
      const createTaskData = {
        title: formData.title,
        ...(formData.description && { description: formData.description }),
        columnId: currentTaskColumnId,
        ...(formData.projectNumber && {
          projectNumber: formData.projectNumber,
        }),
        ...(formData.assignee && { assignee: formData.assignee }),
        ...(formData.assigner && { assigner: formData.assigner }),
        ...(formData.priority && { priority: formData.priority }),
        ...(formData.itemType && { itemType: formData.itemType }),
        ...(formData.initiative && { initiative: formData.initiative }),
        ...(formData.estimateSize && { estimateSize: formData.estimateSize }),
        ...(formData.startDate && { startDate: formData.startDate }),
        ...(formData.deadline && { deadline: formData.deadline }),
        ...(formData.tags && { tags: formData.tags }),
      };
      await createTask(createTaskData);
    }
  };

  const handleUpdateTaskSubmit = async (formData: TaskFormData) => {
    if (currentTask) {
      const updateTaskData = {
        title: formData.title,
        ...(formData.description !== undefined && {
          description: formData.description,
        }),
        ...(formData.projectNumber !== undefined && {
          projectNumber: formData.projectNumber,
        }),
        ...(formData.assignee !== undefined && { assignee: formData.assignee }),
        ...(formData.assigner !== undefined && { assigner: formData.assigner }),
        ...(formData.priority !== undefined && { priority: formData.priority }),
        ...(formData.itemType !== undefined && { itemType: formData.itemType }),
        ...(formData.initiative !== undefined && {
          initiative: formData.initiative,
        }),
        ...(formData.estimateSize !== undefined && {
          estimateSize: formData.estimateSize,
        }),
        ...(formData.startDate !== undefined && {
          startDate: formData.startDate,
        }),
        ...(formData.deadline !== undefined && { deadline: formData.deadline }),
        ...(formData.tags !== undefined && { tags: formData.tags }),
      };
      await updateTask(currentTask.id, updateTaskData);
    }
  };

  // Navigation handler
  const handleNavigateHome = () => {
    navigate('/');
  };

  // Close modals
  const handleCloseModals = () => {
    setShowCreateColumn(false);
    setShowEditColumn(false);
    setShowCreateTask(false);
    setShowEditTask(false);
    setCurrentColumn(null);
    setCurrentTask(null);
    setCurrentTaskColumnId('');
  };

  console.log(
    '🎨 BoardPage render - loading:',
    loading.board,
    'currentBoard:',
    !!currentBoard,
    'id:',
    id
  );

  // Loading state
  if (loading.board) {
    console.log('⏳ Showing loading state');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  // Board not found
  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Board not found</p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Common props for all views
  const commonViewProps = {
    boardId: id,
    onCreateColumn: handleCreateColumn,
    onEditColumn: handleEditColumn,
    onDeleteColumn: handleDeleteColumn,
    onCreateTask: handleCreateTask,
    onEditTask: handleEditTask,
    onDeleteTask: handleDeleteTask,
    onNavigateHome: handleNavigateHome,
  };

  // Temporarily disable multi-view, only render BoardView
  const renderCurrentView = () => {
    return <BoardView {...commonViewProps} />;
  };

  return (
    <div className="h-full flex flex-col bg-surface-50">
      {/* Board Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={handleNavigateHome}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-2 py-1 rounded-button transition-all"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {currentBoard.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {currentBoard.name}
              </h1>
              {currentBoard.description && (
                <p className="text-gray-600 text-sm md:text-base">
                  {currentBoard.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Add Column Button - responsive */}
              <button
                onClick={handleCreateColumn}
                className="bg-primary-500 hover:bg-primary-600 text-white px-3 md:px-4 py-2 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-1 md:gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Column</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden">{renderCurrentView()}</div>

      {/* Modals */}
      <ColumnForm
        isOpen={showCreateColumn}
        onClose={handleCloseModals}
        onSubmit={handleCreateColumnSubmit}
        isLoading={loading.creating}
      />

      <ColumnForm
        isOpen={showEditColumn}
        onClose={handleCloseModals}
        onSubmit={handleUpdateColumnSubmit}
        column={currentColumn}
        isLoading={loading.updating}
      />

      <TaskForm
        isOpen={showCreateTask}
        onClose={handleCloseModals}
        onSubmit={handleCreateTaskSubmit}
        isLoading={loading.creating}
      />

      <TaskForm
        isOpen={showEditTask}
        onClose={handleCloseModals}
        onSubmit={handleUpdateTaskSubmit}
        task={currentTask}
        isLoading={loading.updating}
      />

      {/* Development View Info - temporarily disabled */}
    </div>
  );
};

// Main page component - ViewProvider is already in App.tsx
export const BoardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BoardPageContent />
    </div>
  );
};
