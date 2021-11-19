import { rootStore } from '../store/store';
import config from '../config';
import { chainsEnum } from '../types';

export const isNativeToken = (tokenName: string) => {
  const { NATIVE_TOKENS } = config;
  return (
    NATIVE_TOKENS[rootStore.networks.currentNetwork as chainsEnum].native ===
    tokenName.toLowerCase()
  );
};
