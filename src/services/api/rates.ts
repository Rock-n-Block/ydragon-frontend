import { axiosWithToken } from '../../core/axios';

export default {
  getRates: () => axiosWithToken.get('rates/'),
};
