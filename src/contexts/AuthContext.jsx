import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

const AuthContext = createContext({});

// Decode JWT payload (no library needed)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = decodeToken(token);
      // Check token hasn't expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.id, email: decoded.email });
      } else {
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signUp = async (email, password) => {
    try {
      const data = await api.post('/api/auth/signup', { email, password });
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      const data = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign out function
  const signOut = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
