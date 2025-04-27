
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  env: import.meta.env.MODE || 'development',
  isProduction: import.meta.env.PROD
};

