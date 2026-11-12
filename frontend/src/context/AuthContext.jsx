import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCurrentUser } from '../data/mockData';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('reconnect_user');
    return saved ? JSON.parse(saved) : mockCurrentUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem('reconnect_user');
    return user ? true : true; // Initialized to active session for demo convenience
  });

  // Verify and sync with backend on session start
  useEffect(() => {
    async function syncCurrentUser() {
      const token = localStorage.getItem('reconnect_token');
      if (token) {
        try {
          const freshUser = await authService.getMe();
          if (freshUser) {
            setCurrentUser(freshUser);
            setIsAuthenticated(true);
          }
        } catch (e) {}
      }
    }
    syncCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('reconnect_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('reconnect_user');
      localStorage.removeItem('reconnect_token');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    setCurrentUser(res.user);
    setIsAuthenticated(true);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setCurrentUser(res.user);
    setIsAuthenticated(true);
    return res;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedFields) => {
    try {
      await userService.updateProfile(updatedFields);
    } catch (e) {}
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const addRePoints = (points, reason) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        rePoints: (prev.rePoints || 0) + points,
        rewardsHistory: [
          {
            id: 'rw_' + Date.now(),
            action: reason,
            points: points,
            date: new Date().toISOString().split('T')[0],
            type: points >= 0 ? 'earn' : 'redeem'
          },
          ...(prev.rewardsHistory || [])
        ]
      };
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
      addRePoints
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
