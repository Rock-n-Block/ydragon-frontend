import { axiosWithToken } from '../../core/axios';

export default {
  getIndexes: () => axiosWithToken.get('indexes/'),
  getIndexById: (id: number) => axiosWithToken.get(`indexes/${id}`),
  getIndexesRebalance: (indexId: number) => axiosWithToken.get(`indexes/${indexId}/rebalance/`),
  putIndexesRebalance: (indexId: number,data:any) => axiosWithToken.put(`indexes/${indexId}/rebalance/`,data),
};
