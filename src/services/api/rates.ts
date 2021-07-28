import axios from '../../core/axios';
import { rootStore } from '../../store/store';

export default {
  getRates: () => axios.get('rates/'),
  getNetworkTokens: () =>
    axios.get(`rates/fullinfo?network=${rootStore.networks.currentNetwork}`),
};
