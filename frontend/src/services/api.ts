import axios from 'axios';
import { config } from '../config/environment';


const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

function validateToken(token: string): boolean {
  // Check if the token has the proper JWT format (three parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('Invalid token format - not a JWT');
    return false;
  }
  return true;
}

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (validateToken(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.error('Invalid token format. Not using token.');
        localStorage.removeItem('token'); // Remove invalid token
      }
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
    return Promise.reject(error);
    }
  }
);

// Add a response interceptor to debug auth issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Auth error detail:', error.response.data);
      // You can uncomment these if you want automatic logout on auth errors
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const standupService = {
  // Create new standup
  create: (data: { date: string; yesterday: string; today: string; blockers?: string }) =>
    api.post('/standups', data),

  // Get user's standups
  getMine: async (params?: { page?: number; limit?: number; search?: string }) =>
  {
      return api.get('/standups/mine',{params});    
  },

  // Get single standup
  getOne: (id: string) =>
    api.get(`/standups/${id}`),

  // Update standup
  update: (id: string, data: { yesterday: string; today: string; blockers?: string }) =>
    api.put(`/standups/${id}`, data),

  // Delete standup
  delete: (id: string) =>
    api.delete(`/standups/${id}`),

  // Get team standups
  getTeamStandups: (date: string) =>
    api.get('/standups/team/standups', { params: { date } }),

  // Get team statistics
  getTeamStats: (startDate: string, endDate: string) =>
    api.get('/standups/team/stats', { params: { startDate, endDate } })
};

export const authService = {
  // Login user
  login: (credentials: { email: string; password: string }) =>{
    const response = api.post('/auth/login', credentials)
    return response;
  },
    

  // Register user
  signup: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', userData),

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getMyStandUps: async () => {
    const response = await api.get('/standups/mine');
    return response.data;
},

  // Get all users
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  // Get a single user by ID
  getUser: async (id: string) => {
    const response = await api.get(`/auth/user/${id}`);
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
  }
};

export default api;
