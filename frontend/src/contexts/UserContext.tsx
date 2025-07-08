import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, UserContextValue } from '../types';
import { httpClient } from '../services/api';

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取所有用户
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<User[]>('/users');

      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // 登录功能
  const login = async (userId: string, password: string): Promise<void> => {
    // 验证密码
    if (password !== '1234') {
      throw new Error('Incorrect password');
    }

    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    setCurrentUser(user);
    setIsAuthenticated(true);

    // 保存认证状态到localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUserId', userId);
  };

  // 登出功能
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);

    // 清除localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserId');
  };

  // 切换用户（只有已认证用户才能切换）
  const switchUser = (userId: string) => {
    if (!isAuthenticated) {
      return;
    }

    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', userId);
    }
  };

  // 从localStorage恢复认证状态
  const restoreAuthState = () => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUserId = localStorage.getItem('currentUserId');

    if (savedAuth === 'true' && savedUserId && users.length > 0) {
      const user = users.find((u) => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // 如果用户不存在，清除无效的认证状态
        logout();
      }
    }
  };

  // 初始化
  useEffect(() => {
    fetchUsers();
  }, []);

  // 用户列表加载完成后，尝试恢复认证状态
  useEffect(() => {
    if (users.length > 0) {
      restoreAuthState();
    }
  }, [users]);

  const value: UserContextValue = {
    currentUser,
    users,
    isAuthenticated,
    switchUser,
    login,
    logout,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 自定义Hook
export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
