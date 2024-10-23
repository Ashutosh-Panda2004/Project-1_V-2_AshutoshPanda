import axios from 'axios';

// Create an Axios instance with the base URL proxied by Vite
const api = axios.create({
  baseURL: 'https://project-1-v-2-ashutoshpanda.onrender.com', // Vite will proxy this to http://localhost:5000/api
});

export default api;
