  // src/api/index.js
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'https://cloud1.vxdemo.pro/api/v1',
    // baseURL: 'http://localhost:26000/api/v1',
  });

  export default api;

