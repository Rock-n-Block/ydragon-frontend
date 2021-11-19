import axios from '../../core/axios';
import { rootStore } from '../../store/store';
import { BACKEND_NETWORKS } from '../../config';
import { chainsEnum } from '../../types';

export default {
  getUserIndexes: () => axios.get('indexes/user/'),
  getCoinsList: (name: string) =>
    axios.get(`/coins_list/api/indexes/`, {
      params: {
        search_pattern: name,
        network: BACKEND_NETWORKS[rootStore.networks.currentNetwork as chainsEnum],
      },
    }),
};
