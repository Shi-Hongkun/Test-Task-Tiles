import React, { useState, useMemo } from 'react';
import {
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Circle,
  Tag,
} from 'lucide-react';
import { useBoardContext } from '../../contexts/BoardContext';
import { useViewContext } from '../../contexts/ViewContext';
import {
  Task,
  Priority,
  ItemType,
  EstimateSize,
  TaskListItem,
  ListViewColumn,
} from '../../types';
import { cn } from '../../utils/cn';

interface ListViewProps {
  boardId: string;
  onCreateColumn: () => void;
  onEditColumn: (column: any) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
  onNavigateHome: () => void;
}

// Priority icons and colors
const PRIORITY_CONFIG = {
  [Priority.URGENT]: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  [Priority.HIGH]: {
    icon: ArrowUp,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  [Priority.MEDIUM]: {
    icon: Circle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  [Priority.LOW]: {
    icon: ArrowDown,
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
};

// Item type colors
const ITEM_TYPE_COLORS = {
  [ItemType.TASK]: 'bg-blue-100 text-blue-800',
  [ItemType.BUG]: 'bg-red-100 text-red-800',
  [ItemType.FEATURE]: 'bg-green-100 text-green-800',
  [ItemType.ENHANCEMENT]: 'bg-purple-100 text-purple-800',
  [ItemType.PRODUCT_A]: 'bg-indigo-100 text-indigo-800',
  [ItemType.PRODUCT_B]: 'bg-pink-100 text-pink-800',
};

// Table columns definition
const TABLE_COLUMNS: ListViewColumn[] = [
  { key: 'title', label: 'Task', sortable: true, width: 'w-1/4' },
  { key: 'columnName', label: 'Status', sortable: true, width: 'w-24' },
  { key: 'priority', label: 'Priority', sortable: true, width: 'w-28' },
  { key: 'assignee', label: 'Assignee', sortable: true, width: 'w-36' },
  { key: 'deadline', label: 'Due Date', sortable: true, width: 'w-32' },
  { key: 'itemType', label: 'Type', sortable: true, width: 'w-24' },
  { key: 'estimateSize', label: 'Size', sortable: true, width: 'w-20' },
  { key: 'actions', label: '', sortable: false, width: 'w-24', align: 'right' },
];

const ListView: React.FC<ListViewProps> = ({
  onCreateTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { currentBoard } = useBoardContext();
  const { viewState, updateSettings } = useViewContext();

  // Local state
  const [showCompleted, setShowCompleted] = useState(
    viewState.settings.showCompleted ?? true
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Convert tasks to list items
  const taskListItems = useMemo((): TaskListItem[] => {
    if (!currentBoard) return [];

    const allTasks: TaskListItem[] = [];

    currentBoard.columns.forEach((column) => {
      column.tasks.forEach((task) => {
        const now = new Date();
        const deadline = task.deadline ? new Date(task.deadline) : null;
        const isOverdue = deadline ? deadline < now : false;
        const daysToDue = deadline
          ? Math.ceil(
              (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
          : undefined;

        allTasks.push({
          ...task,
          columnName: column.name,
          isOverdue,
          daysToDue,
        });
      });
    });

    return allTasks;
  }, [currentBoard]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = taskListItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignee?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by completed status
    if (!showCompleted) {
      filtered = filtered.filter(
        (task) => !task.columnName.toLowerCase().includes('done')
      );
    }

    // Sort
    const sortBy = viewState.settings.sortBy || 'created';
    const sortOrder = viewState.settings.sortOrder || 'desc';

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof TaskListItem];
      let bValue: any = b[sortBy as keyof TaskListItem];

      // Handle date sorting
      if (
        sortBy === 'deadline' ||
        sortBy === 'created' ||
        sortBy === 'updated'
      ) {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    taskListItems,
    searchTerm,
    showCompleted,
    viewState.settings.sortBy,
    viewState.settings.sortOrder,
  ]);

  // Handle sorting
  const handleSort = (columnKey: keyof TaskListItem) => {
    const currentSortBy = viewState.settings.sortBy;
    const currentSortOrder = viewState.settings.sortOrder;

    let newSortOrder: 'asc' | 'desc' = 'asc';

    if (currentSortBy === columnKey) {
      newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    }

    updateSettings({
      sortBy: columnKey as any,
      sortOrder: newSortOrder,
    });
  };

  // Handle task creation
  const handleCreateTask = () => {
    if (currentBoard && currentBoard.columns.length > 0) {
      onCreateTask(currentBoard.columns[0].id);
    }
  };

  // Format date
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Render priority
  const renderPriority = (priority: Priority) => {
    const config = PRIORITY_CONFIG[priority];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium',
          config.bg
        )}
      >
        <Icon className={cn('h-3 w-3', config.color)} />
        <span className={config.color}>{priority}</span>
      </div>
    );
  };

  // Render item type
  const renderItemType = (itemType: ItemType) => {
    return (
      <span
        className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          ITEM_TYPE_COLORS[itemType]
        )}
      >
        {itemType}
      </span>
    );
  };

  // Render estimate size
  const renderEstimateSize = (size: EstimateSize) => {
    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
        {size}
      </span>
    );
  };

  // Render sort header
  const renderSortHeader = (column: ListViewColumn) => {
    if (!column.sortable) return column.label;

    const isActive = viewState.settings.sortBy === column.key;
    const isAsc = viewState.settings.sortOrder === 'asc';

    return (
      <button
        onClick={() => handleSort(column.key as keyof TaskListItem)}
        className="flex items-center gap-1 text-left hover:text-primary-600 transition-colors"
      >
        {column.label}
        {isActive ? (
          isAsc ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </button>
    );
  };

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">No board selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 bg-white gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">List View</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-8 pr-4 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Show completed toggle */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="hidden sm:inline">Show completed</span>
            <span className="sm:hidden">Completed</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={handleCreateTask}
            className="bg-primary-500 hover:bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Content - responsive layout */}
      <div className="flex-1 overflow-auto">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                      column.width,
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {renderSortHeader(column)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onEditTask(task)}
                >
                  {/* Task Title */}
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {task.columnName.toLowerCase().includes('done') ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {task.projectNumber && (
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {task.projectNumber}
                            </span>
                          )}
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </h3>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Tag className="h-3 w-3 text-gray-400" />
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{task.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {task.columnName}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    {task.priority && renderPriority(task.priority)}
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {task.assignee
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 truncate">
                          {task.assignee}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3">
                    {task.deadline ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span
                          className={cn(
                            'text-sm',
                            task.isOverdue
                              ? 'text-red-600 font-medium'
                              : 'text-gray-900'
                          )}
                        >
                          {formatDate(task.deadline)}
                        </span>
                        {task.isOverdue && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No date</span>
                    )}
                  </td>

                  {/* Item Type */}
                  <td className="px-4 py-3">
                    {task.itemType && renderItemType(task.itemType)}
                  </td>

                  {/* Estimate Size */}
                  <td className="px-4 py-3">
                    {task.estimateSize && renderEstimateSize(task.estimateSize)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Edit task"
                      >
                        <Edit className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          <div className="p-4 space-y-4">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onEditTask(task)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {task.columnName.toLowerCase().includes('done') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    {task.projectNumber && (
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {task.projectNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Task Title */}
                <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Task Meta Info */}
                <div className="space-y-2">
                  {/* Status and Priority */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {task.columnName}
                    </span>
                    {task.priority && renderPriority(task.priority)}
                    {task.itemType && renderItemType(task.itemType)}
                    {task.estimateSize && renderEstimateSize(task.estimateSize)}
                  </div>

                  {/* Assignee and Date */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {task.assignee ? (
                        <>
                          <div className="flex-shrink-0 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {task.assignee
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <span className="text-gray-900 truncate">
                            {task.assignee}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </div>

                    {task.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span
                          className={cn(
                            'text-sm',
                            task.isOverdue
                              ? 'text-red-600 font-medium'
                              : 'text-gray-900'
                          )}
                        >
                          {formatDate(task.deadline)}
                        </span>
                        {task.isOverdue && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center gap-1 mt-3 flex-wrap">
                    <Tag className="h-3 w-3 text-gray-400" />
                    {task.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {task.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{task.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredAndSortedTasks.length === 0 && (
          <div className="text-center py-12">
            <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first task'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateTask}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredAndSortedTasks.length} of {taskListItems.length}{' '}
            tasks
          </span>
          <div className="flex items-center gap-4">
            <span>
              Sorted by {viewState.settings.sortBy} (
              {viewState.settings.sortOrder})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;
