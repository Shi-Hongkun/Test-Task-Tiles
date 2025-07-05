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
      <Card padding="none" className="h-full flex flex-col">
        {/* Column Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{column.name}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {column.tasks.length}
              </span>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={handleEditColumn}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Column
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
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
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 justify-start"
            onClick={handleCreateTask}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a task
          </Button>
        </div>

        {/* Tasks Container */}
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 p-4 space-y-3 min-h-[200px]',
            isOver && 'bg-blue-50'
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
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm">No tasks yet</p>
                <p className="text-xs">Add a task to get started</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};
