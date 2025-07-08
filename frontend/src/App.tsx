import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BoardProvider } from './contexts/BoardContext';
import { UserProvider } from './contexts/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { BoardsPage } from './pages/BoardsPage';
import { BoardPage } from './pages/BoardPage';

function App() {
  return (
    <UserProvider>
      <BoardProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* 公开路由 */}
              <Route path="/login" element={<LoginPage />} />

              {/* 受保护的路由 */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <BoardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/board/:id"
                element={
                  <ProtectedRoute>
                    <BoardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </BoardProvider>
    </UserProvider>
  );
}

export default App;
