  // src/api/index.js
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:26000/api/v1',
  });

  export default api;

