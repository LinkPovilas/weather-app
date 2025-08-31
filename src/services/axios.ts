import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
