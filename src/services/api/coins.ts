import axios from '../../core/axios';
import { rootStore } from '../../store/store';
import config, { TChain } from '../../config';

const { BACKEND_NETWORKS } = config;
export default {
  getUserIndexes: () => axios.get('indexes/user'),
  getCoinsList: (name: string) =>
    axios.get(`/coins_list/api/indexes/`, {
      params: {
        search_pattern: name,
        network: BACKEND_NETWORKS[rootStore.networks.currentNetwork as TChain],
      },
    }),
};
