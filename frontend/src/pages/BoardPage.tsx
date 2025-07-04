import React from 'react'
import { useParams } from 'react-router-dom'

export const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Board {id}</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 overflow-x-auto pb-4">
          <div className="flex-shrink-0 w-80">
            <div className="card p-4">
              <h3 className="font-medium text-gray-900 mb-4">To Do</h3>
              <div className="space-y-3">
                <div className="card p-3 cursor-pointer hover:shadow-card-hover">
                  <h4 className="font-medium text-gray-900">Sample Task</h4>
                  <p className="text-sm text-gray-600 mt-1">This is a sample task description</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-80">
            <div className="card p-4">
              <h3 className="font-medium text-gray-900 mb-4">In Progress</h3>
              <div className="space-y-3">
                {/* Empty column */}
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-80">
            <div className="card p-4">
              <h3 className="font-medium text-gray-900 mb-4">Done</h3>
              <div className="space-y-3">
                {/* Empty column */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 