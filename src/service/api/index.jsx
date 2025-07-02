import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

export const fetchVisits = () => api.get('/visit/visits');
export const postVisit = (data) => api.post('/visit/visits', data);
export const login = (credentials) => api.post('/cs/login', credentials);
