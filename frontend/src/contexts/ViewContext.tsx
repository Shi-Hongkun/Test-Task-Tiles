import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import { ViewType, ViewState, ViewSettings, ViewContextValue } from '../types';

// Initial view settings
const initialViewSettings: ViewSettings = {
  sortBy: 'created',
  sortOrder: 'desc',
  groupBy: 'column',
  showCompleted: true,
  showDescription: true,
  dateRange: undefined,
};

// Initial view state
const initialViewState: ViewState = {
  currentView: ViewType.BOARD,
  settings: initialViewSettings,
  isLoading: false,
};

// View action types
type ViewAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ViewSettings> }
  | { type: 'RESET_SETTINGS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | {
      type: 'RESTORE_FROM_URL';
      payload: { view: ViewType; settings: Partial<ViewSettings> };
    };

// View reducer
const viewReducer = (state: ViewState, action: ViewAction): ViewState => {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'RESET_SETTINGS':
      return {
        ...state,
        settings: initialViewSettings,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'RESTORE_FROM_URL':
      return {
        ...state,
        currentView: action.payload.view,
        settings: {
          ...state.settings,
          ...action.payload.settings,
        },
      };

    default:
      return state;
  }
};

// Create context
const ViewContext = createContext<ViewContextValue | undefined>(undefined);

// View provider component (simplified - no URL sync for now)
export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [viewState, dispatch] = useReducer(viewReducer, initialViewState);

  // Action handlers
  const setView = useCallback((view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const updateSettings = useCallback((settings: Partial<ViewSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const resetSettings = useCallback(() => {
    dispatch({ type: 'RESET_SETTINGS' });
  }, []);

  const value: ViewContextValue = {
    viewState,
    setView,
    updateSettings,
    resetSettings,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

// Custom hook to use view context
export const useViewContext = (): ViewContextValue => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useViewContext must be used within a ViewProvider');
  }
  return context;
};

// View configurations
export const VIEW_CONFIGS = {
  [ViewType.BOARD]: {
    type: ViewType.BOARD,
    label: 'Board',
    icon: 'LayoutGrid',
    description: 'Kanban-style board with columns',
  },
  [ViewType.LIST]: {
    type: ViewType.LIST,
    label: 'List',
    icon: 'List',
    description: 'Table view with sortable columns',
  },
  [ViewType.CALENDAR]: {
    type: ViewType.CALENDAR,
    label: 'Calendar',
    icon: 'Calendar',
    description: 'Calendar view by deadline dates',
  },
  [ViewType.TIMELINE]: {
    type: ViewType.TIMELINE,
    label: 'Timeline',
    icon: 'GanttChart',
    description: 'Timeline view with task durations',
  },
} as const;
