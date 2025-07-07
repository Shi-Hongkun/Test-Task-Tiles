import React, { useState, useEffect } from 'react';
import { ChevronDown, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface UserSwitcherProps {
  users: User[];
  currentUser: User | null;
  onUserSwitch: (userId: string) => void;
  loading?: boolean;
}

export const UserSwitcher: React.FC<UserSwitcherProps> = ({
  users,
  currentUser,
  onUserSwitch,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUserSelect = (userId: string) => {
    onUserSwitch(userId);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 关闭下拉菜单
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-switcher')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="user-switcher relative">
        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-switcher relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">
          {currentUser?.avatar || <UserIcon className="w-4 h-4" />}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">
            {currentUser?.name || 'Select User'}
          </span>
          <span className="text-xs text-gray-500">
            {currentUser?.role || 'No role'}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentUser?.id === user.id
                    ? 'bg-blue-50 border-r-2 border-blue-500'
                    : ''
                }`}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                {currentUser?.id === user.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
