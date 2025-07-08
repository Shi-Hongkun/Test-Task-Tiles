import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoardContext } from '../contexts/BoardContext';
import { Task, ColumnWithTasks, TaskFormData, ColumnFormData } from '../types';
import { BoardView } from '../components/BoardView';
import { TaskForm, ColumnForm } from '../components/forms';

export const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentBoard,
    loading,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
  } = useBoardContext();

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
    if (
      window.confirm(
        'Are you sure you want to delete this column? All tasks in this column will be lost.'
      )
    ) {
      await deleteColumn(columnId);
    }
  };

  const handleCreateColumnSubmit = async (formData: ColumnFormData) => {
    if (currentBoard) {
      await createColumn({
        name: formData.name,
        boardId: currentBoard.id,
      });
    }
  };

  const handleUpdateColumnSubmit = async (formData: ColumnFormData) => {
    if (currentColumn) {
      await updateColumn(currentColumn.id, {
        name: formData.name,
      });
    }
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
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleCreateTaskSubmit = async (formData: TaskFormData) => {
    if (currentTaskColumnId) {
      const createTaskData = {
        title: formData.title,
        columnId: currentTaskColumnId,
        ...(formData.description && { description: formData.description }),
        ...(formData.projectNumber && {
          projectNumber: formData.projectNumber,
        }),
        ...(formData.assignee && { assignee: formData.assignee }),
        ...(formData.assigner && { assigner: formData.assigner }),
        ...(formData.priority && { priority: formData.priority }),
        ...(formData.itemType && { itemType: formData.itemType }),
        ...(formData.initiative && { initiative: formData.initiative }),
        ...(formData.estimateSize && { estimateSize: formData.estimateSize }),
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

  return (
    <div className="min-h-screen bg-gray-50">
      <BoardView
        boardId={id}
        onCreateColumn={handleCreateColumn}
        onEditColumn={handleEditColumn}
        onDeleteColumn={handleDeleteColumn}
        onCreateTask={handleCreateTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onNavigateHome={handleNavigateHome}
      />

      {/* Create Column Modal */}
      <ColumnForm
        isOpen={showCreateColumn}
        onClose={handleCloseModals}
        onSubmit={handleCreateColumnSubmit}
        isLoading={loading.creating}
      />

      {/* Edit Column Modal */}
      <ColumnForm
        isOpen={showEditColumn}
        onClose={handleCloseModals}
        onSubmit={handleUpdateColumnSubmit}
        column={currentColumn}
        isLoading={loading.updating}
      />

      {/* Create Task Modal */}
      <TaskForm
        isOpen={showCreateTask}
        onClose={handleCloseModals}
        onSubmit={handleCreateTaskSubmit}
        isLoading={loading.creating}
      />

      {/* Edit Task Modal */}
      <TaskForm
        isOpen={showEditTask}
        onClose={handleCloseModals}
        onSubmit={handleUpdateTaskSubmit}
        task={currentTask}
        isLoading={loading.updating}
      />
    </div>
  );
};
