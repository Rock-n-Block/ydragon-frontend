import axios from 'axios';
import config from '../config';

const { BACKEND_URL } = config;
axios.defaults.baseURL = BACKEND_URL;

axios.interceptors.request.use(
  (axiosRequestConfig) => {
    axiosRequestConfig.headers.common = {
      ...axiosRequestConfig.headers.common,
      Authorization: `${
        localStorage.getItem('ydr_token') ? `Token ${localStorage.getItem('yd_token')}` : ''
      }`,
    };
    return axiosRequestConfig;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);
export default axios;
