import axios from 'axios';

axios.defaults.baseURL = 'https://dev-ydragon.rocknblock.io/api/';

export const axiosWithToken = axios.create({
  headers: {
    common: {
      Authorization: `${sessionStorage.getItem('yd_token') ? `Token ${sessionStorage.getItem('yd_token')}` : ''}`,
    },
  },
});
export default axios;
