import axios from 'axios';

axios.defaults.baseURL = 'https://dev-ydragon.rocknblock.io/api/';

export const axiosWithToken = axios.create({
  headers: {
    common: {
      Authorization: `${localStorage.yd_token ? `Token ${localStorage.yd_token}` : ''}`,
    },
  },
});
export default axios;
