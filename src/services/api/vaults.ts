import axios from '../../core/axios';

export default {
  getVaults: (indexId: number) => axios.get(`vaults/${indexId}/`),
};
