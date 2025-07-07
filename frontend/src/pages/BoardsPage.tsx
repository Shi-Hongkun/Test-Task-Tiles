import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users } from 'lucide-react';
import { useBoardContext } from '../contexts/BoardContext';
import { BoardFormData } from '../types';
import { Card, Button } from '../components/ui';
import { BoardForm } from '../components/forms';

export const BoardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { boards, loading, fetchBoards, createBoard } = useBoardContext();
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  // Load boards on component mount
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

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

  if (loading.boards) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-card flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                Task Tiles
              </h1>
              <p className="text-gray-600">
                Modern project management made simple
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Board Card */}
          <div
            className="bg-white border-2 border-dashed border-gray-300 hover:border-primary-400 cursor-pointer rounded-card shadow-card hover:shadow-card-hover transition-all group"
            onClick={() => setShowCreateBoard(true)}
          >
            <div className="text-center py-10 px-6">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create New Board
              </h3>
              <p className="text-sm text-gray-600">
                Start organizing your work
              </p>
            </div>
          </div>

          {/* Existing Boards */}
          {boards.map((board) => (
            <div
              key={board.id}
              className="bg-white cursor-pointer rounded-card shadow-card hover:shadow-card-hover transition-all group"
              onClick={() => handleBoardClick(board.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {board.name}
                    </h3>
                    {board.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(board.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {boards.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-card shadow-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Task Tiles!
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first board to start organizing your projects and
                tasks
              </p>
              <button
                onClick={() => setShowCreateBoard(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-button font-medium shadow-sm hover:shadow transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Create Your First Board
              </button>
            </div>
          </div>
        )}

        {/* Create Board Modal */}
        <BoardForm
          isOpen={showCreateBoard}
          onClose={() => setShowCreateBoard(false)}
          onSubmit={handleCreateBoard}
          isLoading={loading.creating}
        />
      </div>
    </div>
  );
};
