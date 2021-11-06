import axios from '../../core/axios';

export default {
  getTvl: () => axios.get('rates/tvl/'),
  getYdrPrice: () => axios.get<{ ydragon: string }>('rates/ydragon/'),
};
