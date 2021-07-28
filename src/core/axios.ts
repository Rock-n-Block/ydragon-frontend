import axios from 'axios';

axios.defaults.baseURL = 'https://dev-ydragon.rocknblock.io/api/';

/* export const axiosWithToken = axios.create({
  headers: {
    common: {
      Authorization: `${
        sessionStorage.getItem('yd_token') ? `Token ${sessionStorage.getItem('yd_token')}` : ''
      }`,
    },
  },
}); */
axios.interceptors.request.use(
  (config) => {
    config.headers.common = {
      ...config.headers.common,
      Authorization: `${
        sessionStorage.getItem('yd_token') ? `Token ${sessionStorage.getItem('yd_token')}` : ''
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
