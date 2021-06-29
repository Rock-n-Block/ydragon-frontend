import React, { useEffect, useState } from 'react';

import { Stake, StakingStatistics } from '../../components';
import { useWalletConnectorContext } from '../../services/walletConnect';

const StakePage: React.FC = () => {
  const walletConnector = useWalletConnectorContext();
  const [stakeTokensList, setStakeTokensList] = useState<any[]>([]);
  useEffect(() => {
    walletConnector.metamaskService.getStakingTokensLen().then(async (tokensLength: number) => {
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
        console.log(newAddress, newPair);
        if (newPair[0]) {
          // eslint-disable-next-line no-await-in-loop
          const newTokenFirst = await getTokenInfo(newPair[0]);
          tokensList.push(newTokenFirst);
        }
        if (newPair[1]) {
          // eslint-disable-next-line no-await-in-loop
          const newTokenSecond = await getTokenInfo(newPair[1]);
          tokensList.push(newTokenSecond);
        }
      }
      setStakeTokensList(tokensList);
    });
  }, [walletConnector.metamaskService]);

  useEffect(() => {
    console.log();
  }, []);
  return (
    <main className="container">
      <Stake tokens={stakeTokensList} />
      <StakingStatistics />
    </main>
  );
};

export default StakePage;
