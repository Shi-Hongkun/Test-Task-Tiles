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
  const [loading, setLoading] = useState(true);

  // 获取所有用户
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<User[]>('/users');

      if (response.success && response.data) {
        setUsers(response.data);

        // 默认选择第一个用户 (Emma Thompson)
        if (response.data.length > 0 && !currentUser) {
          setCurrentUser(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换用户
  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      // 可以在这里保存到 localStorage 以便刷新页面后记住用户选择
      localStorage.setItem('currentUserId', userId);
    }
  };

  // 从 localStorage 恢复用户选择
  const restoreUserSelection = () => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId && users.length > 0) {
      const user = users.find((u) => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
  };

  // 初始化
  useEffect(() => {
    fetchUsers();
  }, []);

  // 用户列表加载完成后，尝试恢复用户选择
  useEffect(() => {
    if (users.length > 0) {
      restoreUserSelection();
    }
  }, [users]);

  const value: UserContextValue = {
    currentUser,
    users,
    switchUser,
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
