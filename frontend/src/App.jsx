import React, { createContext, useContext, useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export const API_BASE_URL = 'http://localhost:8081';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
        }
        throw new Error('Có lỗi xảy ra kết nối đến server.');
      }

      // Check if content-length is empty
      const text = await response.text();
      if (!text) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }

      const data = JSON.parse(text);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return { success: true };
      } else {
        throw new Error('Phản hồi không hợp lệ từ server.');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login: loginUser,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  if (!user) {
    return <Login />;
  }

  return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
