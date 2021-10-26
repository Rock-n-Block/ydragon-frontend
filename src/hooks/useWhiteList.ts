import { useCallback, useEffect, useState } from 'react';

// import bncDark from '../assets/img/icons/icon-binance-dark.svg';
// import bncLight from '../assets/img/icons/icon-binance-light.svg';
// import plgDark from '../assets/img/icons/icon-polygon-dark.svg';
// import plgLight from '../assets/img/icons/icon-polygon-light.svg';
import { indexesApi } from '../services/api';
import { useMst } from '../store/store';
import config, { TChain } from '../config';

export const useWhiteList = (indexId: number) => {
  const { networks } = useMst();
  const { NETWORK_TOKENS, NATIVE_TOKENS } = config;
  const currentNetwork = networks.currentNetwork as TChain;
  const [whiteList, setWhiteList] = useState<any[]>([]);
  // const networkToken = useCallback(() => {
  //   return {
  //     bnb: {
  //       symbol: 'bnb',
  //       address: '0x0000000000000000000000000000000000000000',
  //       decimals: 18,
  //       name: 'Binance Coin',
  //       image: theme.value === 'dark' ? bncDark : bncLight,
  //     },
  //     polygon: {
  //       symbol: 'matic',
  //       address: '0x0000000000000000000000000000000000000000',
  //       decimals: 18,
  //       name: 'Polygon (Matic)',
  //       image: theme.value === 'dark' ? plgDark : plgLight,
  //     },
  //   };
  // }, [theme.value]);

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
        const newToken = isWrappedToken
          ? [NETWORK_TOKENS[currentNetwork], ...data.tokens]
          : [...data.tokens];
        setWhiteList(newToken);
      })
      .catch((err) => {
        console.log(`err in getting index ${indexId} whitelist:\n`, err);
      });
  }, [NETWORK_TOKENS, currentNetwork, findWrappedToken, indexId]);

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
