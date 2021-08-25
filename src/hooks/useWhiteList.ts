import { useCallback, useEffect, useState } from 'react';

import bncDark from '../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../assets/img/icons/icon-binance-light.svg';
import plgDark from '../assets/img/icons/icon-polygon-dark.svg';
import plgLight from '../assets/img/icons/icon-polygon-light.svg';
import { indexesApi } from '../services/api';
import { useMst } from '../store/store';

export const useWhiteList = (indexId: number) => {
  const { theme, networks } = useMst();
  const [whiteList, setWhiteList] = useState<any[]>([]);
  const networkToken = useCallback(() => {
    return {
      bnb: {
        symbol: 'bnb',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        name: 'Binance Coin',
        image: theme.value === 'dark' ? bncDark : bncLight,
      },
      polygon: {
        symbol: 'matic',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        name: 'Polygon (Matic)',
        image: theme.value === 'dark' ? plgDark : plgLight,
      },
    };
  }, [theme.value]);

  const findWrappedToken = useCallback(
    (tokens: any[]) => {
      const wrappedNativeSymbol =
        networks.currentNetwork === 'binance-smart-chain' ? 'wbnb' : 'wmatic';
      return tokens.find((token: any) => token.symbol.toLowerCase() === wrappedNativeSymbol);
    },
    [networks.currentNetwork],
  );
  const getWhiteList = useCallback(() => {
    indexesApi
      .getIndexWhiteList(indexId)
      .then(({ data }) => {
        const isWrappedToken = !!findWrappedToken(data.tokens);
        const newToken = isWrappedToken
          ? [
              networks.currentNetwork === 'binance-smart-chain'
                ? networkToken().bnb
                : networkToken().polygon,
              ...data.tokens,
            ]
          : [...data.tokens];
        setWhiteList(newToken);
      })
      .catch((err) => {
        console.log(`err in getting index ${indexId} whitelist:\n`, err);
      });
  }, [findWrappedToken, indexId, networkToken, networks.currentNetwork]);

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
