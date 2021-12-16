import React from 'react';
import { observer } from 'mobx-react';

import StakingTableRow from './StakingTableRow';
// import { useWalletConnectorContext } from '../../../services/walletConnect';
// import { useMst } from '../../../store/store';

import './StakingTable.scss';

interface IStakingTableProps {
  ydrPrice: string;
}

const StakingTable: React.FC<IStakingTableProps> = observer(({ ydrPrice }) => {
  // const walletConnector = useWalletConnectorContext();
  // const { networks } = useMst();

  // const [stakesCount, setStakesCount] = useState(0);
  //
  // const getStakesCount = useCallback(() => {
  //   walletConnector.walletService.getStakesCount().then((count: number) => {
  //     setStakesCount(count);
  //   });
  // }, [walletConnector.walletService]);

  // useEffect(() => {
  //   if (networks.currentNetwork) {
  //     getStakesCount();
  //   }
  // }, [getStakesCount, networks.currentNetwork]);

  return (
    <section className="section">
      <div className="staking-table">
        <div className="staking-table_header">
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell">Wallet</div>
          <div className="staking-table_header__cell">Deposited</div>
          <div className="staking-table_header__cell">Your Rewards</div>
          <div className="staking-table_header__cell">TVL</div>
          <div className="staking-table_header__cell">APR</div>
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell" />
        </div>
        <div className="staking-table_body">
          {new Array(2).fill(1).map((el, i) => (
            // eslint-disable-next-line
            <StakingTableRow key={i} index={i} ydrPrice={ydrPrice} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default StakingTable;
