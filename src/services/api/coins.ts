import axios from '../../core/axios';
import { rootStore } from '../../store/store';

export default {
  getUserIndexes: () => axios.get('indexes/user'),
  getCoinsList: (name: string) =>
    axios.get(
      `/coins_list/api/indexes/?search_pattern=${name}&network=${rootStore.networks.currentNetwork}`,
    ),
};
