import axios from '../../core/axios';
import { rootStore } from '../../store/store';

export default {
  getBaseTokens: () => axios.get(`basic_tokens?network=${rootStore.networks.currentNetwork}`),
};
