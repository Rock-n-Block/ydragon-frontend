import axios from '../../core/axios';

export default {
  getTvl: () => axios.get('rates/tvl'),
};
