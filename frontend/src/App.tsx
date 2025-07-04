import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { BoardsPage } from './pages/BoardsPage'
import { BoardPage } from './pages/BoardPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<BoardsPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 