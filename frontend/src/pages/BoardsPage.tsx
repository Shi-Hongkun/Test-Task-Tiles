import React from 'react'

export const BoardsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Tiles</h1>
        <p className="text-gray-600">Visual project management boards</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 border-2 border-dashed border-gray-300 hover:border-primary-500 cursor-pointer">
          <div className="text-center">
            <div className="text-4xl text-gray-400 mb-4">+</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Board</h3>
            <p className="text-sm text-gray-600">Start organizing your tasks</p>
          </div>
        </div>
      </div>
    </div>
  )
} 