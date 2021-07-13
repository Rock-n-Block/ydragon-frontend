import { axiosWithToken } from '../../core/axios';
import { rootStore } from '../../store/store';

export default {
  getUserIndexes: () => axiosWithToken.get('indexes/user'),
  getCoinsList: (name: string) =>
    axiosWithToken.get(
      `/coins_list/api/indexes/?search_pattern=${name}&network=${rootStore.networks.currentNetwork}`,
    ),
};
