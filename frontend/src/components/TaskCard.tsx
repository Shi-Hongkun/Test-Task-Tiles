import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { Task } from '../types';
import { Card, Button } from './ui';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('group relative', isDragging && 'opacity-50')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        hover
        padding="sm"
        className={cn(
          'cursor-pointer select-none',
          isDragging && 'shadow-lg rotate-2'
        )}
        onClick={handleEdit}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute top-2 right-2 p-1 rounded cursor-grab active:cursor-grabbing',
            'text-gray-400 hover:text-gray-600',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            isHovered && 'opacity-100'
          )}
        >
          <GripVertical className="h-3 w-3" />
        </div>

        {/* Task Content */}
        <div className="pr-8">
          <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-3">
              {task.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            'absolute top-1 left-1 flex gap-1',
            'opacity-0 group-hover:opacity-100 transition-opacity'
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleEdit}
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </Card>
    </div>
  );
};
