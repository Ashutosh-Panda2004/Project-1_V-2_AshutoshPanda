// import axios from 'axios';

// // Create an Axios instance with the base URL proxied by Vite
// const api = axios.create({
//   baseURL: '/api', // Vite will proxy this to http://localhost:5000/api
// });

// export default api;








import axios from 'axios';

const api = axios.create({
  baseURL: 'https://project-1-v-2-ashutoshpanda.onrender.com/api', // Update with your backend URL
  withCredentials: true, // Include credentials if your backend needs them
});

export default api;
