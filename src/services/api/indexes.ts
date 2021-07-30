import axios from '../../core/axios';
import { rootStore } from '../../store/store';

export default {
  getUserIndexes: () => axios.get(`indexes/user?network=${rootStore.networks.currentNetwork}`),
  getAdminIndexes: () => axios.get(`indexes/admin?network=${rootStore.networks.currentNetwork}`),
  getImeIndexes: () => axios.get(`indexes/ime?network=${rootStore.networks.currentNetwork}`),
  getImeById: (id: number, address?: string) =>
    axios.get(`indexes/ime/${id}${address ? `?address=${address}` : '/'}`),
  getIndexById: (id: number) => axios.get(`indexes/${id}`),
  getIndexesRebalance: (indexId: number) => axios.get(`indexes/${indexId}/rebalance/`),
  addParamsToIndex: (tx_hash: string, description: string, price?: string) =>
    axios.post(`indexes/index_params/`, {
      tx_hash,
      description,
      price,
    }),
  patchIndexesApr: (indexId: number, token_info: any) =>
    axios.patch(`indexes/apr/${indexId}`, {
      token_info,
    }),
  getStakingStatistic: (address: string) => axios.get(`indexes/staking/${address}`),
  putIndexesRebalance: (indexId: number, data: any) =>
    axios.put(`indexes/${indexId}/rebalance/`, data),
  launchRebalance: (indexId: number) => axios.post(`indexes/${indexId}/rebalance/launch/`, {}),
  addTokenToIndex: (indexId: number, symbol: string) =>
    axios.post(`/indexes/${indexId}/rebalance/tokens/`, { symbol, new_weight: 0 }),
  removeTokenFromIndex: (indexId: number, tokenId: number) =>
    axios.delete(`/indexes/${indexId}/rebalance/tokens/${tokenId}/`),
  addTokenBackToIndex: (indexId: number, tokenId: number) =>
    axios.put(`/indexes/${indexId}/rebalance/tokens/${tokenId}/`, {}),
  getIndexTokensChart: (indexId: string, days: string) =>
    axios.get(`/indexes/info/${indexId}${days !== 'max' ? `?days=${days}` : ''}`),
};
