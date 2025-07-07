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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser ? `${currentUser.name}'s Boards` : 'Project Boards'}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentUser
              ? `Welcome back, ${currentUser.name}!`
              : 'Manage your projects and tasks'}
          </p>
        </div>
        <UserSwitcher
          users={users}
          currentUser={currentUser}
          onUserSwitch={handleUserSwitch}
          loading={userLoading}
        />
      </div>

      {/* Current user info */}
      {currentUser && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{currentUser.avatar}</div>
            <div>
              <p className="font-medium text-blue-900">{currentUser.role}</p>
              <p className="text-sm text-blue-600">{currentUser.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Boards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create new board card */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
          <div
            className="p-6 text-center"
            onClick={() => setShowCreateBoard(true)}
          >
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create New Board
            </h3>
            <p className="text-gray-600">
              Start a new project or organize your tasks
            </p>
          </div>
        </Card>

        {/* Existing boards */}
        {boards.map((board) => (
          <Card
            key={board.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleBoardClick(board.id)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {board.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {board.description || 'No description'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(board.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Team</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {boards.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No boards available
            </h3>
            <p className="text-gray-600 mb-4">
              {currentUser
                ? `${currentUser.name} doesn't have access to any boards yet.`
                : 'Get started by creating your first board.'}
            </p>
            <Button onClick={() => setShowCreateBoard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Board
            </Button>
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
