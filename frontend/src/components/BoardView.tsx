import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Home, ChevronRight } from 'lucide-react';
import { Task, ColumnWithTasks } from '../types';
import { useBoardContext } from '../contexts/BoardContext';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from './TaskCard';
import { Button } from './ui';
interface BoardViewProps {
  boardId: string;
  onCreateColumn: () => void;
  onEditColumn: (column: ColumnWithTasks) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onNavigateHome: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  boardId,
  onCreateColumn,
  onEditColumn,
  onDeleteColumn,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onNavigateHome,
}) => {
  const { currentBoard, loading, fetchBoard, updateTaskPosition } =
    useBoardContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load board data
  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
    }
  }, [boardId, fetchBoard]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task);
    }
  };

  // Handle drag over (for preview)
  const handleDragOver = (_event: DragOverEvent) => {
    // Could implement preview logic here
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Only handle task dragging for now
    if (activeType === 'task') {
      const task = active.data.current?.task as Task;

      if (!task) return;

      // Dragging over a column
      if (overType === 'column') {
        const column = over.data.current?.column as ColumnWithTasks;

        if (!column) return;

        // Calculate new position (append to end of column)
        const newPosition = column.tasks.length;

        // Only update if position or column changed
        if (task.columnId !== column.id || task.position !== newPosition) {
          await updateTaskPosition(task.id, column.id, newPosition);
        }
      }
      // Dragging over another task
      else if (overType === 'task') {
        const overTask = over.data.current?.task as Task;

        if (!overTask || task.id === overTask.id) return;

        // Same column - reorder
        if (task.columnId === overTask.columnId) {
          const column = currentBoard?.columns.find(
            (col) => col.id === task.columnId
          );
          if (!column) return;

          const oldIndex = column.tasks.findIndex((t) => t.id === task.id);
          const newIndex = column.tasks.findIndex((t) => t.id === overTask.id);

          if (oldIndex !== newIndex) {
            await updateTaskPosition(task.id, task.columnId, newIndex);
          }
        }
        // Different column - move to new column at target position
        else {
          const targetColumn = currentBoard?.columns.find(
            (col) => col.id === overTask.columnId
          );
          if (!targetColumn) return;

          const newIndex = targetColumn.tasks.findIndex(
            (t) => t.id === overTask.id
          );
          await updateTaskPosition(task.id, overTask.columnId, newIndex);
        }
      }
    }
  };

  if (loading.board) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Board not found</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const columnIds = currentBoard.columns.map((col) => col.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col bg-surface-50">
        {/* Board Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="p-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={onNavigateHome}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {currentBoard.name}
                </h1>
                {currentBoard.description && (
                  <p className="text-gray-600">{currentBoard.description}</p>
                )}
              </div>

              <button
                onClick={onCreateColumn}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Column
              </button>
            </div>
          </div>
        </div>

        {/* Board Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full p-6">
            <SortableContext
              items={columnIds}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-6 h-full min-w-max">
                {currentBoard.columns.map((column) => (
                  <BoardColumn
                    key={column.id}
                    column={column}
                    onEditColumn={onEditColumn}
                    onDeleteColumn={onDeleteColumn}
                    onCreateTask={onCreateTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}

                {/* Add Column Button */}
                <div className="flex-shrink-0 w-80">
                  <button
                    onClick={onCreateColumn}
                    className="w-full h-32 bg-white hover:bg-surface-50 border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-card transition-all flex items-center justify-center text-gray-500 hover:text-primary-600"
                  >
                    <div className="text-center">
                      <Plus className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">
                        Add another list
                      </span>
                    </div>
                  </button>
                </div>

                {/* Empty State */}
                {currentBoard.columns.length === 0 && (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="text-center bg-white rounded-card p-8 shadow-card">
                      <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-7 w-7 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Ready to get organized?
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md">
                        Create your first column to start organizing tasks into
                        a workflow
                      </p>
                      <button
                        onClick={onCreateColumn}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2 mx-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Column
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 opacity-95 scale-105">
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
