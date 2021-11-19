import { rootStore } from '../store/store';
import config from '../config';
import { chainsEnum } from '../types';

export const isNativeToken = (tokenName: string): boolean => {
  const { NATIVE_TOKENS } = config;
  if (rootStore.networks.currentNetwork) {
    return (
      NATIVE_TOKENS[rootStore.networks.currentNetwork as chainsEnum].native ===
      tokenName.toLowerCase()
    );
  }
  return false;
};
