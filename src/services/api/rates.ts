import axios from '../../core/axios';

export default {
  getRates: () => axios.get('rates/'),
};
