import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users } from 'lucide-react';
import { useBoardContext } from '../contexts/BoardContext';
import { useUserContext } from '../contexts/UserContext';
import { BoardFormData } from '../types';
import { Card, Button } from '../components/ui';
import { BoardForm } from '../components/forms';
import { UserSwitcher } from '../components/UserSwitcher';

export const BoardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { boards, loading, fetchBoards, createBoard } = useBoardContext();
  const {
    currentUser,
    users,
    switchUser,
    logout,
    loading: userLoading,
  } = useUserContext();
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  // Load boards when user changes
  useEffect(() => {
    if (currentUser) {
      fetchBoards(currentUser.id);
    }
  }, [currentUser, fetchBoards]);

  const handleCreateBoard = async (formData: BoardFormData) => {
    const createBoardData = {
      name: formData.name,
      ...(formData.description && { description: formData.description }),
    };

    const board = await createBoard(createBoardData);

    if (board) {
      // Navigate to the new board
      navigate(`/board/${board.id}`);
    }
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  const handleUserSwitch = (userId: string) => {
    switchUser(userId);
  };

  const handleLogout = () => {
    logout();
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading.boards) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header with user switcher */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Boards</h1>
            <p className="text-gray-600 mt-2">Manage your projects and tasks</p>
          </div>
          <UserSwitcher
            users={users}
            currentUser={currentUser}
            onUserSwitch={handleUserSwitch}
            onLogout={handleLogout}
            loading={userLoading}
          />
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading boards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with user switcher */}
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {currentUser ? `${currentUser.name}'s Workspace` : 'Task Tiles'}
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 ml-15">
            {currentUser
              ? `Manage your boards and stay organized`
              : 'Modern project management made simple'}
          </p>
        </div>
        <UserSwitcher
          users={users}
          currentUser={currentUser}
          onUserSwitch={handleUserSwitch}
          onLogout={handleLogout}
          loading={userLoading}
        />
      </div>

      {/* Current user info */}
      {currentUser && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {currentUser.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {currentUser.name}
                </h3>
                <p className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                  {currentUser.role}
                </p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
              <div className="text-xs text-gray-400">
                {boards.length} board{boards.length !== 1 ? 's' : ''} accessible
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Boards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create new board card */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
          <div
            className="p-8 text-center"
            onClick={() => setShowCreateBoard(true)}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Create New Board
            </h3>
            <p className="text-gray-600 group-hover:text-blue-700 transition-colors">
              Start a new project or organize your tasks
            </p>
          </div>
        </Card>

        {/* Existing boards */}
        {boards.map((board, index) => (
          <Card
            key={board.id}
            className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative"
            onClick={() => handleBoardClick(board.id)}
          >
            {/* 渐变背景装饰 */}
            <div
              className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${
                index % 3 === 0
                  ? 'from-blue-500 to-indigo-600'
                  : index % 3 === 1
                    ? 'from-purple-500 to-pink-600'
                    : 'from-green-500 to-teal-600'
              }`}
            ></div>

            <div className="p-6 pt-8">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {board.name}
                </h3>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    index % 3 === 0
                      ? 'bg-blue-100 text-blue-600'
                      : index % 3 === 1
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-green-100 text-green-600'
                  } group-hover:scale-110 transition-transform duration-200`}
                >
                  <span className="text-lg font-bold">
                    {board.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors">
                {board.description ||
                  'No description available for this board.'}
              </p>

              {/* Board 统计信息 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-500 group-hover:text-blue-600 transition-colors">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(board.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 group-hover:text-purple-600 transition-colors">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Team</span>
                  </div>
                </div>

                {/* 活跃状态指示器 */}
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {boards.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-lg mx-auto">
            {/* 动画图标 */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="text-6xl">📋</div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-400 opacity-20 rounded-full animate-ping"></div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No boards available
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {currentUser
                ? `${currentUser.name} doesn't have access to any boards yet. Start organizing your work by creating your first board!`
                : 'Get started by creating your first board to organize your projects and tasks.'}
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => setShowCreateBoard(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Board
              </Button>

              <p className="text-sm text-gray-500">
                Start with templates for HR, project management, or event
                planning
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create board form modal */}
      {showCreateBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Board</h2>
            <BoardForm
              onSubmit={handleCreateBoard}
              onCancel={() => setShowCreateBoard(false)}
              loading={loading.creating}
            />
          </div>
        </div>
      )}
    </div>
  );
};
