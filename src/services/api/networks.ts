import axios from '../../core/axios';

export default {
  getNetworks: () => axios.get('/networks/'),
};
