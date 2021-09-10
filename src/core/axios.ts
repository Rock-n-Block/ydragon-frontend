import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    config.headers.common = {
      ...config.headers.common,
      Authorization: `${
        localStorage.getItem('yd_token') ? `Token ${localStorage.getItem('yd_token')}` : ''
      }`,
    };
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);
export default axios;
