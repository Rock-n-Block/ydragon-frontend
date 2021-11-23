import { useCallback, useEffect, useState } from 'react';

// import bncDark from '../assets/img/icons/icon-binance-dark.svg';
// import bncLight from '../assets/img/icons/icon-binance-light.svg';
// import plgDark from '../assets/img/icons/icon-polygon-dark.svg';
// import plgLight from '../assets/img/icons/icon-polygon-light.svg';
import { indexesApi } from '../services/api';
import { useMst } from '../store/store';
import config from '../config';
import { chainsEnum } from '../types';

export const useWhiteList = (indexId: number) => {
  const { networks, theme } = useMst();
  const { NETWORK_TOKENS, NATIVE_TOKENS } = config;
  const currentNetwork = networks.currentNetwork as chainsEnum;
  const [whiteList, setWhiteList] = useState<any[]>([]);

  const findWrappedToken = useCallback(
    (tokens: any[]) => {
      return tokens.find(
        (token: any) => token.symbol.toLowerCase() === NATIVE_TOKENS[currentNetwork].wrapped,
      );
    },
    [NATIVE_TOKENS, currentNetwork],
  );
  const getWhiteList = useCallback(() => {
    indexesApi
      .getIndexWhiteList(indexId)
      .then(({ data }) => {
        const isWrappedToken = !!findWrappedToken(data.tokens);
        const newToken = {
          ...NETWORK_TOKENS[currentNetwork],
          image: NETWORK_TOKENS[currentNetwork].image(theme.value),
        };
        const newTokens = isWrappedToken ? [newToken, ...data.tokens] : [...data.tokens];
        setWhiteList(newTokens);
      })
      .catch((err) => {
        console.error(`err in getting index ${indexId} whitelist:\n`, err);
      });
  }, [NETWORK_TOKENS, currentNetwork, findWrappedToken, indexId, theme.value]);

  const getToken = useCallback(
    (symbol: string) => {
      return whiteList.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
    },
    [whiteList],
  );
  const getTokenAddress = useCallback(
    (symbol: string) => {
      return getToken(symbol)?.address;
    },
    [getToken],
  );
  useEffect(() => {
    if (indexId) {
      getWhiteList();
    }
  }, [getWhiteList, indexId]);

  return { whiteList, getToken, getTokenAddress };
};
