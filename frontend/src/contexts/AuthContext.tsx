
import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { authService } from '../services/api';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProviderComponent({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Update API authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      

      // Fetch user data
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          // If token is invalid, clear everything
          setToken(null);
          setUser(null);
          // localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        });
    } else {
      // localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({email, password});
      const { token: newToken, user: userData } = response.data;
      console.log('Login successful Test', userData);

      // Set token in localStorage and update API headers
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Update state
      setToken(newToken);

      try {
        // Try to get fresh user data
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser as any);
        const myStandUps = await authService.getMyStandUps();
        console.log('My Stand Ups:', myStandUps);
      } catch (error) {
        // Fallback to user data from login response if getCurrentUser fails
        setUser(userData);
        console.error('Failed to fetch current user data:', error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
    const response = await api.post('/auth/signup', { email, password, name });
    const { token: newToken } = response.data;
       // Store token and update headers
       localStorage.setItem('token', newToken);
       api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(response.data.token);
    setUser(response.data.user);
    }catch(error){
      console.error('Signup failed', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    token,
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthHook() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 4. Default export for the component
export const AuthProvider = AuthProviderComponent;

// 5. Named export for the hook
export const useAuth = useAuthHook;