import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Edit,
  Trash2,
  GripVertical,
  Calendar,
  User,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Task, Priority, ItemType, EstimateSize } from '../types';
import { Card, Button } from './ui';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

// Helper functions for styling
const getPriorityColor = (priority?: Priority): string => {
  switch (priority) {
    case Priority.URGENT:
      return 'bg-red-100 text-red-800 border-red-200';
    case Priority.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case Priority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case Priority.LOW:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getItemTypeColor = (itemType?: ItemType): string => {
  switch (itemType) {
    case ItemType.BUG:
      return 'bg-red-500 text-white';
    case ItemType.FEATURE:
      return 'bg-blue-500 text-white';
    case ItemType.ENHANCEMENT:
      return 'bg-purple-500 text-white';
    case ItemType.PRODUCT_A:
      return 'bg-green-500 text-white';
    case ItemType.PRODUCT_B:
      return 'bg-cyan-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getEstimateSizeColor = (size?: EstimateSize): string => {
  switch (size) {
    case EstimateSize.XS:
    case EstimateSize.S:
      return 'bg-green-100 text-green-800';
    case EstimateSize.M:
      return 'bg-yellow-100 text-yellow-800';
    case EstimateSize.L:
      return 'bg-orange-100 text-orange-800';
    case EstimateSize.XL:
    case EstimateSize.XXL:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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
          'cursor-pointer select-none relative overflow-hidden',
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

        {/* Header with Project Number and Item Type */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {task.projectNumber && (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {task.projectNumber}
              </span>
            )}
            {task.itemType && (
              <span
                className={cn(
                  'text-xs font-medium px-2 py-1 rounded',
                  getItemTypeColor(task.itemType)
                )}
              >
                {task.itemType}
              </span>
            )}
          </div>

          {task.priority && (
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                task.priority === Priority.URGENT
                  ? 'bg-red-500'
                  : task.priority === Priority.HIGH
                    ? 'bg-orange-500'
                    : task.priority === Priority.MEDIUM
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
              )}
            ></div>
          )}
        </div>

        {/* Task Title */}
        <h4 className="font-medium text-gray-900 text-sm leading-tight mb-2 pr-8">
          {task.title}
        </h4>

        {/* Task Details Grid */}
        <div className="space-y-1 text-xs">
          {task.initiative && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-16">Initiative:</span>
              <span className="text-gray-700">{task.initiative}</span>
            </div>
          )}

          {task.assignee && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-16">Assignee:</span>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-gray-400" />
                <span className="text-gray-700">{task.assignee}</span>
              </div>
            </div>
          )}

          {task.estimateSize && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-16">Size:</span>
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-xs',
                  getEstimateSizeColor(task.estimateSize)
                )}
              >
                {task.estimateSize}
              </span>
            </div>
          )}

          {task.deadline && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-16">Deadline:</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-gray-700">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

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

        {/* Status indicator based on deadline */}
        {task.deadline && new Date(task.deadline) < new Date() && (
          <div className="absolute bottom-1 right-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
          </div>
        )}
      </Card>
    </div>
  );
};
