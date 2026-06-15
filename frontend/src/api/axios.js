import axios from 'axios';

// In production set VITE_API_URL (e.g. https://your-app.onrender.com/api) in Vercel.
// Falls back to the local backend during development.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;