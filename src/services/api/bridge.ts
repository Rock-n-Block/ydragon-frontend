import axios from '../../core/axios';

const baseUrl = 'https://bridge.ydragon.io/api/v1/';

export default {
  getInfo: () => axios.get(`${baseUrl}networks`),
};
