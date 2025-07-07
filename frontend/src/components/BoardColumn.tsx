import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { ColumnWithTasks, Task } from '../types';
import { Card, Button } from './ui';
import { TaskCard } from './TaskCard';
import { cn } from '../utils/cn';

interface BoardColumnProps {
  column: ColumnWithTasks;
  onEditColumn: (column: ColumnWithTasks) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

// Helper function to get column status color
const getColumnStatusColor = (columnName: string): string => {
  const name = columnName.toLowerCase();
  if (
    name.includes('todo') ||
    name.includes('to do') ||
    name.includes('backlog')
  ) {
    return 'border-status-todo';
  } else if (
    name.includes('progress') ||
    name.includes('working') ||
    name.includes('doing')
  ) {
    return 'border-status-progress';
  } else if (
    name.includes('review') ||
    name.includes('testing') ||
    name.includes('qa')
  ) {
    return 'border-status-review';
  } else if (
    name.includes('done') ||
    name.includes('completed') ||
    name.includes('finished')
  ) {
    return 'border-status-done';
  }
  return 'border-gray-300';
};

const getColumnHeaderColor = (columnName: string): string => {
  const name = columnName.toLowerCase();
  if (
    name.includes('todo') ||
    name.includes('to do') ||
    name.includes('backlog')
  ) {
    return 'text-status-todo';
  } else if (
    name.includes('progress') ||
    name.includes('working') ||
    name.includes('doing')
  ) {
    return 'text-status-progress';
  } else if (
    name.includes('review') ||
    name.includes('testing') ||
    name.includes('qa')
  ) {
    return 'text-status-review';
  } else if (
    name.includes('done') ||
    name.includes('completed') ||
    name.includes('finished')
  ) {
    return 'text-status-done';
  }
  return 'text-gray-700';
};

export const BoardColumn: React.FC<BoardColumnProps> = ({
  column,
  onEditColumn,
  onDeleteColumn,
  onCreateTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
      accepts: ['task'],
    },
  });

  const taskIds = column.tasks.map((task) => task.id);

  const handleCreateTask = () => {
    onCreateTask(column.id);
  };

  const handleEditColumn = () => {
    setShowMenu(false);
    onEditColumn(column);
  };

  const handleDeleteColumn = () => {
    setShowMenu(false);
    onDeleteColumn(column.id);
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div
        className={cn(
          'bg-surface-50 rounded-card h-full flex flex-col border-t-4',
          getColumnStatusColor(column.name)
        )}
      >
        {/* Column Header */}
        <div className="p-4 bg-white rounded-t-card border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3
                className={cn(
                  'font-bold text-sm uppercase tracking-wide',
                  getColumnHeaderColor(column.name)
                )}
              >
                {column.name}
              </h3>
              <span className="bg-surface-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                {column.tasks.length}
              </span>
            </div>

            <div className="relative">
              <button
                className="h-8 w-8 rounded-button flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-card shadow-card border border-gray-200 py-1">
                  <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-surface-50 transition-colors"
                    onClick={handleEditColumn}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Column
                  </button>
                  <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={handleDeleteColumn}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Column
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add Task Button */}
          <button
            className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-surface-50 rounded-button border-2 border-dashed border-gray-200 hover:border-gray-300 transition-all"
            onClick={handleCreateTask}
          >
            <Plus className="h-4 w-4" />
            Add a task
          </button>
        </div>

        {/* Tasks Container */}
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 p-3 space-y-3 min-h-[200px] overflow-y-auto',
            isOver && 'bg-primary-50 bg-opacity-50'
          )}
        >
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>

          {/* Empty State */}
          {column.tasks.length === 0 && (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <div className="text-center">
                <div className="w-12 h-12 bg-surface-200 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Plus className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  No tasks yet
                </p>
                <p className="text-xs text-gray-500">
                  Click above to add your first task
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};
