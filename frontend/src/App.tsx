import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BoardProvider } from './contexts/BoardContext';
import { UserProvider } from './contexts/UserContext';
import { BoardsPage } from './pages/BoardsPage';
import { BoardPage } from './pages/BoardPage';

function App() {
  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default App;
