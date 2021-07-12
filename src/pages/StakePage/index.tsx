import React, { useEffect, useState } from 'react';

import { Stake, StakingStatistics } from '../../components';
import { useWalletConnectorContext } from '../../services/walletConnect';

const StakePage: React.FC = () => {
  const walletConnector = useWalletConnectorContext();
  const [stakeTokensList, setStakeTokensList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    walletConnector.metamaskService
      .getStakingTokensLen()
      .then(async (tokensLength: number) => {
        const tokensList: Array<any> = [];
        const getAddress = async (index: number) => {
          return walletConnector.metamaskService.getStakingTokenToEnter(index);
        };
        const getPair = async (address: string) => {
          return walletConnector.metamaskService.getStakingPair(address);
        };
        const getTokenInfo = async (address: string) => {
          return walletConnector.metamaskService.getTokenInfoByAddress(address);
        };
        for (let i = 0; i < tokensLength; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          const newAddress = await getAddress(i);
          // eslint-disable-next-line no-await-in-loop
          const newPair = await getPair(newAddress);
          if (newAddress) {
            // eslint-disable-next-line no-await-in-loop
            const newTokenFirst = await getTokenInfo(newAddress);
            if (newTokenFirst.balance !== '0') {
              tokensList.push(newTokenFirst);
            }
          }
          if (newPair !== '0x0000000000000000000000000000000000000000') {
            // eslint-disable-next-line no-await-in-loop
            const newTokenSecond = await getTokenInfo(newPair);
            if (newTokenSecond.balance !== '0') {
              tokensList.push(newTokenSecond);
            }
          }
        }
        setStakeTokensList(tokensList);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log('get staking tokens len error', err);
      });
  }, [walletConnector.metamaskService]);

  return (
    <main className="container">
      <Stake tokens={stakeTokensList} propsLoading={loading} />
      <StakingStatistics />
    </main>
  );
};

export default StakePage;
