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
import { Plus } from 'lucide-react';
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
}

export const BoardView: React.FC<BoardViewProps> = ({
  boardId,
  onCreateColumn,
  onEditColumn,
  onDeleteColumn,
  onCreateTask,
  onEditTask,
  onDeleteTask,
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
      <div className="h-full flex flex-col">
        {/* Board Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentBoard.name}
              </h1>
              {currentBoard.description && (
                <p className="mt-1 text-gray-600">{currentBoard.description}</p>
              )}
            </div>

            <Button onClick={onCreateColumn}>
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
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

                {/* Empty State */}
                {currentBoard.columns.length === 0 && (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📋</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No columns yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Create your first column to start organizing tasks
                      </p>
                      <Button onClick={onCreateColumn}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Column
                      </Button>
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
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
