import axios, { axiosWithToken } from '../../core/axios';

export default {
  getUserIndexes: () => axios.get('indexes/user'),
  getAdminIndexes: () => axiosWithToken.get('indexes/admin'),
  getImeIndexes: () => axiosWithToken.get('indexes/ime'),
  getImeById: (id: number, address?: string) =>
    axiosWithToken.get(`indexes/ime/${id}${address ? `?address=${address}` : '/'}`),
  getIndexById: (id: number) => axiosWithToken.get(`indexes/${id}`),
  getIndexesRebalance: (indexId: number) => axiosWithToken.get(`indexes/${indexId}/rebalance/`),
  addDescriptionToIndex: (tx_hash: string, description: string) =>
    axiosWithToken.post('indexes/description', {
      tx_hash,
      description,
    }),
  putIndexesRebalance: (indexId: number, data: any) =>
    axiosWithToken.put(`indexes/${indexId}/rebalance/`, data),
  launchRebalance: (indexId: number) =>
    axiosWithToken.post(`indexes/${indexId}/rebalance/launch/`, {}),
  addTokenToIndex: (indexId: number, symbol: string) =>
    axiosWithToken.post(`/indexes/${indexId}/rebalance/tokens/`, { symbol, new_weight: 0 }),
  removeTokenFromIndex: (indexId: number, tokenId: number) =>
    axiosWithToken.delete(`/indexes/${indexId}/rebalance/tokens/${tokenId}/`),
  addTokenBackToIndex: (indexId: number, tokenId: number) =>
    axiosWithToken.put(`/indexes/${indexId}/rebalance/tokens/${tokenId}/`, {}),
};
