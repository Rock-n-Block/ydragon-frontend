import { axiosWithToken } from '../../core/axios';

export default {
  getUserIndexes: () => axiosWithToken.get('indexes/user'),
  getCoinsList: (name: string) =>
    axiosWithToken.get(`/coins_list/api/indexes/?search_pattern=${name}`),
};
