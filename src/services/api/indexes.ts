import axios, { axiosWithToken } from '../../core/axios';
import { rootStore } from '../../store/store';

export default {
  getUserIndexes: () => axios.get(`indexes/user?network=${rootStore.networks.currentNetwork}`),
  getAdminIndexes: () =>
    axiosWithToken.get(`indexes/admin?network=${rootStore.networks.currentNetwork}`),
  getImeIndexes: () =>
    axiosWithToken.get(`indexes/ime?network=${rootStore.networks.currentNetwork}`),
  getImeById: (id: number, address?: string) =>
    axiosWithToken.get(`indexes/ime/${id}${address ? `?address=${address}` : '/'}`),
  getIndexById: (id: number) => axiosWithToken.get(`indexes/${id}`),
  getIndexesRebalance: (indexId: number) => axiosWithToken.get(`indexes/${indexId}/rebalance/`),
  addDescriptionToIndex: (tx_hash: string, description: string) =>
    axiosWithToken.post(`indexes/description?network=${rootStore.networks.currentNetwork}`, {
      tx_hash,
      description,
    }),
  patchIndexesApr: (indexId: number, token_info: any) =>
    axiosWithToken.patch(`indexes/apr/${indexId}`, {
      token_info,
    }),
  getStakingStatistic: (address: string) => axiosWithToken.get(`indexes/staking/${address}`),
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
  getIndexTokensChart: (indexId: string, days: string) =>
    axios.get(`/indexes/info/${indexId}${days !== 'max' ? `?days=${days}` : ''}`),
};
