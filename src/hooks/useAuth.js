import { useState, useEffect } from 'react';
import userService from '../services/userService';

const LOCAL_STORAGE_KEY = 'skill-sync-user';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return {
    user,
    updateUser,
    logout,
    loading,
  };
}
