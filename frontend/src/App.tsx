import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BoardProvider } from './contexts/BoardContext';
import { BoardsPage } from './pages/BoardsPage';
import { BoardPage } from './pages/BoardPage';

function App() {
  return (
    <BoardProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<BoardsPage />} />
            <Route path="/board/:id" element={<BoardPage />} />
          </Routes>
        </div>
      </Router>
    </BoardProvider>
  );
}

export default App;
