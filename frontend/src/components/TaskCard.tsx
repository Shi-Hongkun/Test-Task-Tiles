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
      return 'bg-red-50 text-red-700 border border-red-200';
    case Priority.HIGH:
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    case Priority.MEDIUM:
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case Priority.LOW:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

const getPriorityDotColor = (priority?: Priority): string => {
  switch (priority) {
    case Priority.URGENT:
      return 'bg-red-500';
    case Priority.HIGH:
      return 'bg-orange-500';
    case Priority.MEDIUM:
      return 'bg-amber-500';
    case Priority.LOW:
      return 'bg-emerald-500';
    default:
      return 'bg-gray-400';
  }
};

const getItemTypeColor = (itemType?: ItemType): string => {
  switch (itemType) {
    case ItemType.BUG:
      return 'bg-red-500 text-white shadow-sm';
    case ItemType.FEATURE:
      return 'bg-blue-500 text-white shadow-sm';
    case ItemType.ENHANCEMENT:
      return 'bg-purple-500 text-white shadow-sm';
    case ItemType.PRODUCT_A:
      return 'bg-emerald-500 text-white shadow-sm';
    case ItemType.PRODUCT_B:
      return 'bg-cyan-500 text-white shadow-sm';
    default:
      return 'bg-gray-500 text-white shadow-sm';
  }
};

const getEstimateSizeColor = (size?: EstimateSize): string => {
  switch (size) {
    case EstimateSize.XS:
    case EstimateSize.S:
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case EstimateSize.M:
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case EstimateSize.L:
      return 'bg-orange-100 text-orange-800 border border-orange-200';
    case EstimateSize.XL:
    case EstimateSize.XXL:
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

const getProjectNumberColor = (projectNumber?: string): string => {
  if (!projectNumber) return 'bg-gray-50 text-gray-600 border border-gray-200';

  // Generate consistent colors based on project number
  const colors = [
    'bg-blue-50 text-blue-700 border border-blue-200',
    'bg-purple-50 text-purple-700 border border-purple-200',
    'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'bg-orange-50 text-orange-700 border border-orange-200',
    'bg-pink-50 text-pink-700 border border-pink-200',
    'bg-cyan-50 text-cyan-700 border border-cyan-200',
  ];

  const hash = projectNumber.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return colors[Math.abs(hash) % colors.length];
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
      <div
        className={cn(
          'bg-white rounded-card border border-gray-200 p-4 cursor-pointer select-none relative overflow-hidden',
          'shadow-card hover:shadow-card-hover transition-all duration-200',
          'group',
          isDragging && 'shadow-card-dragging rotate-1 scale-105'
        )}
        onClick={handleEdit}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute top-3 right-3 p-1 rounded cursor-grab active:cursor-grabbing',
            'text-gray-400 hover:text-gray-600',
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            isHovered && 'opacity-100'
          )}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Header with Project Number and Item Type */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {task.projectNumber && (
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-1 rounded-button',
                  getProjectNumberColor(task.projectNumber)
                )}
              >
                {task.projectNumber}
              </span>
            )}
            {task.itemType && (
              <span
                className={cn(
                  'text-xs font-medium px-2 py-1 rounded-button',
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
                'w-3 h-3 rounded-full flex-shrink-0 mt-0.5',
                getPriorityDotColor(task.priority)
              )}
            ></div>
          )}
        </div>

        {/* Task Title */}
        <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-3 pr-8 line-clamp-2">
          {task.title}
        </h4>

        {/* Task Meta Information */}
        <div className="space-y-2">
          {task.initiative && (
            <div className="flex items-center text-xs text-gray-600">
              <span className="font-medium text-gray-500 w-20">
                Initiative:
              </span>
              <span className="truncate">{task.initiative}</span>
            </div>
          )}

          {task.assignee && (
            <div className="flex items-center text-xs text-gray-600">
              <span className="font-medium text-gray-500 w-20">Assignee:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {task.assignee.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{task.assignee}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {task.estimateSize && (
              <span
                className={cn(
                  'px-2 py-1 rounded-button text-xs font-medium',
                  getEstimateSizeColor(task.estimateSize)
                )}
              >
                {task.estimateSize}
              </span>
            )}

            {task.deadline && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span
                  className={cn(
                    new Date(task.deadline) < new Date()
                      ? 'text-red-600 font-medium'
                      : ''
                  )}
                >
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-surface-100 text-gray-700 px-2 py-1 rounded-button border border-surface-200"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{task.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={cn(
            'absolute top-2 left-2 flex gap-1',
            'opacity-0 group-hover:opacity-100 transition-all duration-200'
          )}
        >
          <button
            className="h-7 w-7 rounded-button bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
            onClick={handleEdit}
          >
            <Edit className="h-3 w-3 text-gray-600" />
          </button>

          <button
            className="h-7 w-7 rounded-button bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </button>
        </div>

        {/* Overdue indicator */}
        {task.deadline && new Date(task.deadline) < new Date() && (
          <div className="absolute bottom-3 right-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-3 w-3 text-red-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
