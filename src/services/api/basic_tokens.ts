import axios from '../../core/axios';
import { rootStore } from '../../store/store';
import config, { TChain } from '../../config';

const { BACKEND_NETWORKS } = config;

export default {
  getBaseTokens: () =>
    axios.get(`basic_tokens`, {
      params: {
        network: BACKEND_NETWORKS[rootStore.networks.currentNetwork as TChain],
      },
    }),
};
