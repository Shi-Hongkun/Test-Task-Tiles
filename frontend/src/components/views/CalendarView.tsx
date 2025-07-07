import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Filter,
  Settings,
} from 'lucide-react';
import { useBoardContext } from '../../contexts/BoardContext';
import { useViewContext } from '../../contexts/ViewContext';
import {
  Task,
  Priority,
  ItemType,
  CalendarTask,
  CalendarDay,
} from '../../types';
import { cn } from '../../utils/cn';

interface CalendarViewProps {
  boardId: string;
  onCreateColumn: () => void;
  onEditColumn: (column: any) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
  onNavigateHome: () => void;
}

// Priority colors for calendar
const PRIORITY_COLORS = {
  [Priority.URGENT]: 'bg-red-500 border-red-600',
  [Priority.HIGH]: 'bg-orange-500 border-orange-600',
  [Priority.MEDIUM]: 'bg-yellow-500 border-yellow-600',
  [Priority.LOW]: 'bg-green-500 border-green-600',
};

// Item type colors for calendar
const ITEM_TYPE_COLORS = {
  [ItemType.TASK]: 'bg-blue-500',
  [ItemType.BUG]: 'bg-red-500',
  [ItemType.FEATURE]: 'bg-green-500',
  [ItemType.ENHANCEMENT]: 'bg-purple-500',
  [ItemType.PRODUCT_A]: 'bg-indigo-500',
  [ItemType.PRODUCT_B]: 'bg-pink-500',
};

const CalendarView: React.FC<CalendarViewProps> = ({
  onCreateTask,
  onEditTask,
}) => {
  const { currentBoard } = useBoardContext();
  const { viewState } = useViewContext();

  // Local state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showStartDates, setShowStartDates] = useState(true);
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get current month/year
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Month names
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate calendar tasks
  const calendarTasks = useMemo((): CalendarTask[] => {
    if (!currentBoard) return [];

    const tasks: CalendarTask[] = [];

    currentBoard.columns.forEach((column) => {
      column.tasks.forEach((task) => {
        // Add start date tasks
        if (task.startDate && showStartDates) {
          tasks.push({
            ...task,
            date: new Date(task.startDate),
            isStart: true,
            columnName: column.name,
          } as CalendarTask);
        }

        // Add deadline tasks
        if (task.deadline && showDeadlines) {
          tasks.push({
            ...task,
            date: new Date(task.deadline),
            isStart: false,
            columnName: column.name,
          } as CalendarTask);
        }
      });
    });

    return tasks;
  }, [currentBoard, showStartDates, showDeadlines]);

  // Generate calendar days
  const calendarDays = useMemo((): CalendarDay[] => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    const endDate = new Date(lastDayOfMonth);

    // Adjust to show full weeks
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: CalendarDay[] = [];
    const currentDay = new Date(startDate);
    const today = new Date();

    while (currentDay <= endDate) {
      const dayTasks = calendarTasks.filter(
        (task) => task.date.toDateString() === currentDay.toDateString()
      );

      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === currentMonth,
        isToday: currentDay.toDateString() === today.toDateString(),
        tasks: dayTasks,
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  }, [currentYear, currentMonth, calendarTasks]);

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Task creation handler
  const handleCreateTask = (date?: Date) => {
    if (currentBoard && currentBoard.columns.length > 0) {
      onCreateTask(currentBoard.columns[0].id);
      // Note: In a real implementation, you'd want to set the date on the task
    }
  };

  // Render task item
  const renderTaskItem = (task: CalendarTask) => {
    const isCompleted = task.columnName.toLowerCase().includes('done');
    const isOverdue = !task.isStart && !isCompleted && task.date < new Date();

    return (
      <div
        key={`${task.id}-${task.isStart}`}
        className={cn(
          'text-xs p-1 rounded mb-1 cursor-pointer transition-all hover:shadow-sm',
          task.priority ? PRIORITY_COLORS[task.priority] : 'bg-gray-500',
          'text-white border-l-2',
          isOverdue && 'ring-2 ring-red-300'
        )}
        onClick={() => onEditTask(task)}
        title={`${task.title} - ${task.isStart ? 'Start' : 'Due'} ${task.date.toLocaleDateString()}`}
      >
        <div className="flex items-center gap-1">
          {task.isStart ? (
            <Circle className="h-3 w-3 flex-shrink-0" />
          ) : (
            <Clock className="h-3 w-3 flex-shrink-0" />
          )}
          <span className="truncate font-medium">{task.title}</span>
        </div>

        {task.assignee && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">
                {task.assignee
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <span className="text-xs opacity-90 truncate">{task.assignee}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-75">
            {task.isStart ? 'Start' : 'Due'}
          </span>

          {isOverdue && <AlertCircle className="h-3 w-3 text-red-200" />}

          {isCompleted && <CheckCircle2 className="h-3 w-3 text-green-200" />}
        </div>
      </div>
    );
  };

  // Render calendar day
  const renderCalendarDay = (day: CalendarDay) => {
    const isSelected =
      selectedDate && day.date.toDateString() === selectedDate.toDateString();

    return (
      <div
        key={day.date.toISOString()}
        className={cn(
          'min-h-[120px] border border-gray-200 p-2 bg-white hover:bg-gray-50 transition-colors cursor-pointer',
          !day.isCurrentMonth && 'bg-gray-50 text-gray-400',
          day.isToday && 'bg-blue-50 border-blue-300',
          isSelected && 'ring-2 ring-primary-500'
        )}
        onClick={() => setSelectedDate(day.date)}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              'text-sm font-medium',
              day.isToday && 'text-blue-600 font-bold'
            )}
          >
            {day.date.getDate()}
          </span>

          {day.tasks.length > 0 && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
              {day.tasks.length}
            </span>
          )}
        </div>

        <div className="space-y-1">
          {day.tasks.slice(0, 3).map((task) => renderTaskItem(task))}

          {day.tasks.length > 3 && (
            <div className="text-xs text-gray-500 text-center py-1">
              +{day.tasks.length - 3} more
            </div>
          )}
        </div>
      </div>
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Calendar View
            </h2>
          </div>

          {/* View toggles */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showStartDates}
                onChange={(e) => setShowStartDates(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Start dates
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showDeadlines}
                onChange={(e) => setShowDeadlines(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Deadlines
            </label>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-button transition-colors"
          >
            Today
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-button transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-lg font-semibold min-w-[140px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-button transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => handleCreateTask()}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {/* Week headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day) => renderCalendarDay(day))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 text-gray-400" />
              <span>Start dates</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span>Deadlines</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span>Overdue</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {calendarTasks.length} task{calendarTasks.length !== 1 ? 's' : ''}{' '}
              this month
            </span>

            {selectedDate && (
              <span className="text-primary-600 font-medium">
                Selected: {selectedDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
