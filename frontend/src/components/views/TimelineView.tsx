import React, { useState, useMemo } from 'react';
import {
  GanttChart,
  ZoomIn,
  ZoomOut,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
} from 'lucide-react';
import { useBoardContext } from '../../contexts/BoardContext';
import { useViewContext } from '../../contexts/ViewContext';
import {
  Task,
  Priority,
  ItemType,
  TimelineTask,
  TimelineRow,
} from '../../types';
import { cn } from '../../utils/cn';

interface TimelineViewProps {
  boardId: string;
  onCreateColumn: () => void;
  onEditColumn: (column: any) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
  onNavigateHome: () => void;
}

// Priority colors for timeline
const PRIORITY_COLORS = {
  [Priority.URGENT]: 'bg-red-500 border-red-600',
  [Priority.HIGH]: 'bg-orange-500 border-orange-600',
  [Priority.MEDIUM]: 'bg-yellow-500 border-yellow-600',
  [Priority.LOW]: 'bg-green-500 border-green-600',
};

// Time scale options
const TIME_SCALES = {
  day: { label: 'Day', days: 1 },
  week: { label: 'Week', days: 7 },
  month: { label: 'Month', days: 30 },
} as const;

type TimeScale = keyof typeof TIME_SCALES;

const TimelineView: React.FC<TimelineViewProps> = ({
  onCreateTask,
  onEditTask,
}) => {
  const { currentBoard } = useBoardContext();
  const { viewState } = useViewContext();

  // Local state
  const [timeScale, setTimeScale] = useState<TimeScale>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [groupBy, setGroupBy] = useState<'column' | 'assignee' | 'priority'>(
    'column'
  );
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // Calculate date range for timeline
  const { startDate, endDate, dateRange } = useMemo(() => {
    const today = new Date();
    const scaleInfo = TIME_SCALES[timeScale];
    const totalDays = scaleInfo.days * 4; // Show 4 units of the selected scale

    const start = new Date(currentDate);
    start.setDate(start.getDate() - totalDays / 2);

    const end = new Date(currentDate);
    end.setDate(end.getDate() + totalDays / 2);

    // Generate date markers
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + scaleInfo.days);
    }

    return {
      startDate: start,
      endDate: end,
      dateRange: dates,
    };
  }, [currentDate, timeScale]);

  // Convert tasks to timeline tasks
  const timelineTasks = useMemo((): TimelineTask[] => {
    if (!currentBoard) return [];

    const tasks: TimelineTask[] = [];

    currentBoard.columns.forEach((column) => {
      column.tasks.forEach((task) => {
        if (task.startDate && task.deadline) {
          const start = new Date(task.startDate);
          const end = new Date(task.deadline);
          const duration = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Calculate progress (simplified - based on column position)
          const isCompleted = column.name.toLowerCase().includes('done');
          const isInProgress = column.name.toLowerCase().includes('progress');
          let progress = 0;
          if (isCompleted) progress = 100;
          else if (isInProgress) progress = 50;

          tasks.push({
            ...task,
            columnName: column.name,
            startDate: start,
            endDate: end,
            duration,
            progress,
          } as TimelineTask);
        }
      });
    });

    // Filter overdue if needed
    if (showOverdueOnly) {
      const now = new Date();
      return tasks.filter((task) => task.endDate < now && task.progress < 100);
    }

    return tasks;
  }, [currentBoard, showOverdueOnly]);

  // Group tasks into rows
  const timelineRows = useMemo((): TimelineRow[] => {
    const groups = new Map<string, TimelineTask[]>();

    timelineTasks.forEach((task) => {
      let groupKey: string;

      switch (groupBy) {
        case 'assignee':
          groupKey = task.assignee || 'Unassigned';
          break;
        case 'priority':
          groupKey = task.priority || 'No Priority';
          break;
        case 'column':
        default:
          groupKey = task.columnName;
          break;
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(task);
    });

    return Array.from(groups.entries()).map(([title, tasks]) => ({
      title,
      tasks: tasks.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime()
      ),
      isExpanded: true,
    }));
  }, [timelineTasks, groupBy]);

  // Calculate task position and width
  const getTaskPosition = (task: TimelineTask) => {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const taskStart = Math.max(task.startDate.getTime(), startDate.getTime());
    const taskEnd = Math.min(task.endDate.getTime(), endDate.getTime());

    const left = ((taskStart - startDate.getTime()) / totalDuration) * 100;
    const width = ((taskEnd - taskStart) / totalDuration) * 100;

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  // Navigation handlers
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    const scaleInfo = TIME_SCALES[timeScale];
    newDate.setDate(newDate.getDate() - scaleInfo.days);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    const scaleInfo = TIME_SCALES[timeScale];
    newDate.setDate(newDate.getDate() + scaleInfo.days);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Task creation handler
  const handleCreateTask = () => {
    if (currentBoard && currentBoard.columns.length > 0) {
      onCreateTask(currentBoard.columns[0].id);
    }
  };

  // Render task bar
  const renderTaskBar = (task: TimelineTask) => {
    const position = getTaskPosition(task);
    const isOverdue = task.endDate < new Date() && task.progress < 100;

    return (
      <div key={task.id} className="relative h-8 mb-1">
        <div
          className={cn(
            'absolute h-6 rounded border-l-4 cursor-pointer transition-all hover:shadow-md group',
            task.priority
              ? PRIORITY_COLORS[task.priority]
              : 'bg-gray-500 border-gray-600',
            isOverdue && 'ring-2 ring-red-300'
          )}
          style={position}
          onClick={() => onEditTask(task)}
          title={`${task.title} (${task.startDate.toLocaleDateString()} - ${task.endDate.toLocaleDateString()})`}
        >
          {/* Progress bar */}
          <div
            className="h-full bg-white bg-opacity-30 rounded-r"
            style={{ width: `${task.progress}%` }}
          />

          {/* Task content */}
          <div className="absolute inset-0 flex items-center px-2 text-white text-xs font-medium overflow-hidden">
            <span className="truncate">{task.title}</span>

            {isOverdue && (
              <AlertCircle className="h-3 w-3 ml-1 flex-shrink-0" />
            )}
          </div>

          {/* Hover tooltip */}
          <div className="absolute top-full left-0 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
            <div>{task.title}</div>
            <div>Duration: {task.duration} days</div>
            <div>Progress: {task.progress}%</div>
            {task.assignee && <div>Assignee: {task.assignee}</div>}
          </div>
        </div>
      </div>
    );
  };

  // Render timeline row
  const renderTimelineRow = (row: TimelineRow) => {
    return (
      <div key={row.title} className="border-b border-gray-200">
        {/* Row header */}
        <div className="flex">
          <div className="w-48 p-4 bg-gray-50 border-r border-gray-200 flex items-center">
            <div className="flex items-center gap-2">
              {groupBy === 'assignee' && (
                <User className="h-4 w-4 text-gray-400" />
              )}
              {groupBy === 'column' && (
                <GanttChart className="h-4 w-4 text-gray-400" />
              )}
              {groupBy === 'priority' && (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}

              <span className="font-medium text-gray-900 text-sm truncate">
                {row.title}
              </span>

              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {row.tasks.length}
              </span>
            </div>
          </div>

          {/* Tasks timeline */}
          <div className="flex-1 p-4 relative min-h-[100px]">
            {row.tasks.map((task) => renderTaskBar(task))}

            {row.tasks.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No tasks in this period
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Format date for headers
  const formatDateHeader = (date: Date) => {
    switch (timeScale) {
      case 'day':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      case 'week':
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
      default:
        return date.toLocaleDateString();
    }
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GanttChart className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Timeline View
            </h2>
          </div>

          {/* Group by selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Group by:
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-button px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="column">Status</option>
              <option value="assignee">Assignee</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {/* Show overdue filter */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOverdueOnly}
              onChange={(e) => setShowOverdueOnly(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Show overdue only
          </label>
        </div>

        {/* Navigation and Controls */}
        <div className="flex items-center gap-4">
          {/* Time scale selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-button p-1">
            {Object.entries(TIME_SCALES).map(([key, scale]) => (
              <button
                key={key}
                onClick={() => setTimeScale(key as TimeScale)}
                className={cn(
                  'px-3 py-1 text-sm rounded-button transition-colors',
                  timeScale === key
                    ? 'bg-white text-primary-600 shadow-sm font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {scale.label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-button transition-colors"
            >
              Today
            </button>

            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-gray-100 rounded-button transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={goToNext}
              className="p-2 hover:bg-gray-100 rounded-button transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleCreateTask}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-auto">
        {/* Date headers */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-48 p-4 border-r border-gray-200">
            <span className="text-sm font-medium text-gray-900">
              {groupBy === 'column'
                ? 'Status'
                : groupBy === 'assignee'
                  ? 'Assignee'
                  : 'Priority'}
            </span>
          </div>

          <div className="flex-1 flex">
            {dateRange.map((date, index) => (
              <div
                key={index}
                className="flex-1 p-4 text-center border-r border-gray-200 last:border-r-0"
              >
                <div className="text-xs font-medium text-gray-600">
                  {formatDateHeader(date)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline rows */}
        <div className="relative">
          {/* Today indicator */}
          {currentDate >= startDate && currentDate <= endDate && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{
                left: `${48 * 12 + ((currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * (100 - 48 / 4)}px`, // Approximate position
              }}
            >
              <div className="absolute -top-2 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          )}

          {timelineRows.length > 0 ? (
            timelineRows.map((row) => renderTimelineRow(row))
          ) : (
            <div className="text-center py-12">
              <GanttChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No timeline data
              </h3>
              <p className="text-gray-600 mb-6">
                Tasks need both start dates and deadlines to appear in timeline
                view
              </p>
              <button
                onClick={handleCreateTask}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Normal priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>High priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Urgent priority</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span>Overdue</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {timelineTasks.length} task{timelineTasks.length !== 1 ? 's' : ''}{' '}
              in timeline
            </span>
            <span>Scale: {TIME_SCALES[timeScale].label} view</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
