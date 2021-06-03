import axios from 'axios';

axios.defaults.baseURL = 'https://dev-ydragon.rocknblock.io/api/';

export const axiosWithToken = axios.create({
  headers: {
    common: {
      Authorization: `Token ${localStorage.yd_token ?? ''}`,
    },
  },
});
export default axios;
