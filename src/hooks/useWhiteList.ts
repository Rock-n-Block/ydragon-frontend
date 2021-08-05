import { indexesApi } from '../services/api';
import { useMst } from '../store/store';
import { useCallback, useState } from 'react';
import bncDark from '../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../assets/img/icons/icon-binance-light.svg';
import plgDark from '../assets/img/icons/icon-polygon-dark.svg';
import plgLight from '../assets/img/icons/icon-polygon-light.svg';

export const useWhiteList = () => {
  const { theme, networks } = useMst();
  const networkToken = {
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
  const [whiteList, setWhiteList] = useState<any[]>([]);

  const getWhiteList = useCallback(
    (indexId: number) => {
      indexesApi
        .getIndexWhiteList(indexId)
        .then(({ data }) => {
          setWhiteList([
            networks.currentNetwork === 'binance-smart-chain'
              ? networkToken.bnb
              : networkToken.polygon,
            ...data,
          ]);
        })
        .catch((err) => {
          console.log(`err in getting index ${indexId} whitelist:\n`, err);
        });
    },
    [networkToken.bnb, networkToken.polygon, networks.currentNetwork],
  );

  const getToken = (symbol: string) => {
    return whiteList.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
  };
  const getTokenAddress = (symbol: string) => {
    return getToken(symbol)?.address;
  };

  return { value: whiteList, getWhiteList, getToken, getTokenAddress };
};
