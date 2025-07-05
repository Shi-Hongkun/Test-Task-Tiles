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
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Tiles</h1>
        <p className="text-gray-600">Visual project management boards</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Board Card */}
        <Card
          hover
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"
          onClick={() => setShowCreateBoard(true)}
        >
          <div className="text-center py-8">
            <div className="text-4xl text-gray-400 mb-4">+</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Create New Board
            </h3>
            <p className="text-sm text-gray-600">Start organizing your tasks</p>
          </div>
        </Card>

        {/* Existing Boards */}
        {boards.map((board) => (
          <Card
            key={board.id}
            hover
            className="cursor-pointer"
            onClick={() => handleBoardClick(board.id)}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {board.name}
              </h3>

              {board.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {board.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(board.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Board
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {boards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No boards yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first board to get started
          </p>
          <Button onClick={() => setShowCreateBoard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Board
          </Button>
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
  );
};
