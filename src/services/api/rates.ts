import { axiosWithToken } from '../../core/axios';
import { rootStore } from '../../store/store';

export default {
  getRates: () => axiosWithToken.get('rates/'),
  getNetworkTokens: () =>
    axiosWithToken.get(`rates/fullinfo?network=${rootStore.networks.currentNetwork}`),
};
