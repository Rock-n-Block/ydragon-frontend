import React, { useEffect, useState } from 'react';

import { Stake, StakingStatistics } from '../../components';
import { useWalletConnectorContext } from '../../services/walletConnect';
import spinner from '../../assets/img/icons/spinner.svg';

const StakePage: React.FC = () => {
  const walletConnector = useWalletConnectorContext();
  const [stakeTokensList, setStakeTokensList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
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
        if (newAddress) {
          // eslint-disable-next-line no-await-in-loop
          const newTokenFirst = await getTokenInfo(newAddress);
          tokensList.push(newTokenFirst);
        }
        if (newPair !== '0x0000000000000000000000000000000000000000') {
          // eslint-disable-next-line no-await-in-loop
          const newTokenSecond = await getTokenInfo(newPair);
          tokensList.push(newTokenSecond);
        }
      }
      setStakeTokensList(tokensList);
      setLoading(false);
    });
  }, [walletConnector.metamaskService]);

  useEffect(() => {
    console.log();
  }, []);
  return (
    <main className="container">
      {loading ? (
        <div className="spinner">
          <img alt="" src={spinner} width="50" height="50" />
        </div>
      ) : (
        <Stake tokens={stakeTokensList} />
      )}
      <StakingStatistics />
    </main>
  );
};

export default StakePage;
