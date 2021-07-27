import axios from '../../core/axios';

export default {
  getUserIndexes: () => axios.get('indexes/user'),
  getCoinsList: (name: string) => axios.get(`/coins_list/api/indexes/?search_pattern=${name}`),
};
