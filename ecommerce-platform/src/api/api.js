import axios from 'axios';

const API_URL = 'https://e-commerce-production-fa5d.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;