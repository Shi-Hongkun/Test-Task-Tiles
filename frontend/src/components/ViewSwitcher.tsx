import React from 'react';
import {
  LayoutGrid,
  List,
  Calendar,
  GanttChart,
  Settings,
  Filter,
  Menu,
} from 'lucide-react';
import { ViewType } from '../types';
import { useViewContext, VIEW_CONFIGS } from '../contexts/ViewContext';
import { cn } from '../utils/cn';

// Icon mapping
const ICON_MAP = {
  LayoutGrid,
  List,
  Calendar,
  GanttChart,
} as const;

interface ViewSwitcherProps {
  className?: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  compact?: boolean;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  className,
  showSettings = false,
  onSettingsClick,
  compact = false,
}) => {
  const { viewState, setView } = useViewContext();
  const { currentView } = viewState;

  const handleViewChange = (view: ViewType) => {
    setView(view);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* View Tabs */}
      <div
        className={cn(
          'flex items-center bg-surface-100 rounded-button p-1',
          compact && 'overflow-x-auto scrollbar-hide max-w-[280px]'
        )}
      >
        {Object.values(VIEW_CONFIGS).map((config) => {
          const IconComponent = ICON_MAP[config.icon as keyof typeof ICON_MAP];
          const isActive = currentView === config.type;

          return (
            <button
              key={config.type}
              onClick={() => handleViewChange(config.type)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-button text-sm font-medium transition-all duration-200 flex-shrink-0',
                'hover:bg-white hover:shadow-sm',
                isActive
                  ? 'bg-white text-primary-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900',
                compact && 'px-2'
              )}
              title={config.description}
            >
              <IconComponent className="h-4 w-4" />
              <span
                className={cn(
                  compact ? 'hidden' : 'hidden sm:inline',
                  'transition-all'
                )}
              >
                {config.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* View Controls */}
      {showSettings && (
        <div
          className={cn('flex items-center gap-1', compact ? 'ml-1' : 'ml-2')}
        >
          {!compact && (
            <button
              className="h-9 w-9 rounded-button flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Filter tasks"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onSettingsClick}
            className="h-9 w-9 rounded-button flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="View settings"
          >
            {compact ? (
              <Menu className="h-4 w-4" />
            ) : (
              <Settings className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// Mobile-specific view switcher for small screens
export const MobileViewSwitcher: React.FC<{
  className?: string;
  onSettingsClick?: () => void;
}> = ({ className, onSettingsClick }) => {
  return (
    <ViewSwitcher
      className={className}
      showSettings={true}
      onSettingsClick={onSettingsClick}
      compact={true}
    />
  );
};

// View info component for debugging/development
export const ViewInfo: React.FC = () => {
  const { viewState } = useViewContext();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white text-xs px-3 py-2 rounded-button shadow-lg z-50">
      <div>View: {viewState.currentView}</div>
      <div>
        Sort: {viewState.settings.sortBy} ({viewState.settings.sortOrder})
      </div>
      <div>Group: {viewState.settings.groupBy}</div>
    </div>
  );
};
