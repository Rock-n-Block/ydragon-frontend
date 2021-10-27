import axios from '../../core/axios';
import { rootStore } from '../../store/store';
import config, { TChain } from '../../config';

const { BACKEND_NETWORKS } = config;
export default {
  getUserIndexes: () =>
    axios.get(`indexes/user/`, {
      params: {
        network: BACKEND_NETWORKS[rootStore.networks.currentNetwork as TChain],
      },
    }),
  getAdminIndexes: () =>
    axios.get(`indexes/admin/`, {
      params: {
        network: BACKEND_NETWORKS[rootStore.networks.currentNetwork as TChain],
      },
    }),
  getImeIndexes: () =>
    axios.get(`indexes/ime/`, {
      params: {
        network: BACKEND_NETWORKS[rootStore.networks.currentNetwork as TChain],
      },
    }),
  getIndexById: (id: number) => axios.get(`indexes/${id}`),
  getIndexWhiteList: (id: number) => axios.get(`indexes/${id}/whitelist`),
  getIndexesRebalance: (indexId: number) => axios.get(`indexes/${indexId}/rebalance/`),
  addParamsToIndex: (tx_hash: string, description: string) =>
    axios.post(`indexes/index_params/`, {
      tx_hash,
      description,
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
    axios.get(`/indexes/info/${indexId}`, {
      params: {
        ...(days !== 'max' ? { days } : ''),
      },
    }),
};
