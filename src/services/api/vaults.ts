import { axiosWithToken } from '../../core/axios';

export default {
  getVaults: (indexId: number) => axiosWithToken.get(`vaults/${indexId}/`),
};
