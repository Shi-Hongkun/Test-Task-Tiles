import React, { useState, useEffect } from 'react';
import { ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface UserSwitcherProps {
  users: User[];
  currentUser: User | null;
  onUserSwitch: (userId: string) => void;
  onLogout: () => void;
  loading?: boolean;
}

export const UserSwitcher: React.FC<UserSwitcherProps> = ({
  users,
  currentUser,
  onUserSwitch,
  onLogout,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUserSelect = (userId: string) => {
    onUserSwitch(userId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
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
        <div className="flex items-center space-x-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-2 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-switcher relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] ${
          isOpen
            ? 'shadow-lg border-blue-300 ring-2 ring-blue-100'
            : 'shadow-sm'
        }`}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-lg font-medium text-white shadow-lg">
            {currentUser?.avatar || <UserIcon className="w-5 h-5" />}
          </div>
          {/* 在线状态指示器 */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        </div>

        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {currentUser?.name || 'Select User'}
          </span>
          <span className="text-xs text-gray-500 truncate">
            {currentUser?.role || 'No role'}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 下拉菜单动画 */}
      <div
        className={`absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 transition-all duration-200 transform origin-top ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="py-2">
          {/* 当前用户信息 */}
          {currentUser && (
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xl font-medium text-white">
                  {currentUser.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-blue-600 truncate">
                    {currentUser.role}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 切换用户选项 */}
          <div className="px-2 py-1">
            <p className="px-2 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
              Switch User
            </p>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 mx-1 my-1 rounded-lg text-left transition-all duration-150 transform hover:scale-[1.02] ${
                  currentUser?.id === user.id
                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50'
                }`}
                disabled={currentUser?.id === user.id}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-sm font-medium text-white">
                    {user.avatar}
                  </div>
                  {currentUser?.id === user.id && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      currentUser?.id === user.id
                        ? 'text-blue-900'
                        : 'text-gray-900'
                    } truncate`}
                  >
                    {user.name}
                  </div>
                  <div
                    className={`text-xs ${
                      currentUser?.id === user.id
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    } truncate`}
                  >
                    {user.role}
                  </div>
                </div>
                {currentUser?.id === user.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* 登出按钮 */}
          <div className="px-2 pb-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 mx-1 rounded-lg text-left hover:bg-red-50 transition-all duration-150 text-red-600 transform hover:scale-[1.02]"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
                <LogOut className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-red-700">Sign Out</div>
                <div className="text-xs text-red-500">
                  Log out of your account
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
