import axios from 'axios';

const BASE_URL = 'http://localhost:3000';


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expired or missing, redirecting to login...");
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;