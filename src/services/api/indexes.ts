import { axiosWithToken } from '../../core/axios';

export default {
  getIndexes: () => axiosWithToken.get('indexes/'),
  getIndexById: (id: number) => axiosWithToken.get(`indexes/${id}`),
};
