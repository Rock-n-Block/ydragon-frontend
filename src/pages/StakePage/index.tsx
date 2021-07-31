import React, { useCallback, useEffect, useState } from 'react';

import { Stake, StakingStatistics } from '../../components';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';
import { autorun } from 'mobx';

const StakePage: React.FC = () => {
  const { networks } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [stakeTokensList, setStakeTokensList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getStakingTokens = useCallback(() => {
    setLoading(true);
    walletConnector.metamaskService
      .getStakingTokensLen()
      .then(async (tokensLength: number) => {
        // let tokensList: Array<any> = [];
        const getAddress = async (index: number) => {
          return walletConnector.metamaskService.getStakingTokenToEnter(index);
        };
        const getPair = async (address: string) => {
          return walletConnector.metamaskService.getStakingPair(address);
        };
        const getTokenInfo = async (address: string) => {
          return walletConnector.metamaskService.getTokenInfoByAddress(address);
        };
        for (let i = 0, tokensList: Array<any> = []; i < tokensLength; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          const newAddress = await getAddress(i);
          // eslint-disable-next-line no-await-in-loop
          const newPair = await getPair(newAddress);
          if (newAddress) {
            // eslint-disable-next-line no-await-in-loop
            const newTokenFirst = await getTokenInfo(newAddress);
            if (newTokenFirst.balance !== '0') {
              tokensList = [...tokensList, newTokenFirst];
            }
          }
          if (newPair !== '0x0000000000000000000000000000000000000000') {
            // eslint-disable-next-line no-await-in-loop
            const newTokenSecond = await getTokenInfo(newPair);
            if (newTokenSecond.balance !== '0') {
              tokensList = [...tokensList, newTokenSecond];
            }
          }
          setStakeTokensList(tokensList);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.log('get staking tokens len error', err);
      })
      .finally(() => setLoading(false));
  }, [walletConnector.metamaskService]);
  useEffect(() => {
    autorun(() => {
      if (networks.currentNetwork) {
        getStakingTokens();
      }
    });
  }, [networks.currentNetwork, getStakingTokens]);

  return (
    <main className="container">
      <Stake tokens={stakeTokensList} propsLoading={loading} />
      <StakingStatistics />
    </main>
  );
};

export default StakePage;
