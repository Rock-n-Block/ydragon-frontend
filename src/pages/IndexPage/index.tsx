import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import logo from '../../assets/img/icons/logo.svg';
import { TokenPanel } from '../../components';
import { IndexTable, RebalanceHistory } from '../../components/IndexPage';
import { IToken } from '../../components/IndexPage/IndexTable';
import { indexesApi } from '../../services/api';

import './Index.scss';
import GetInModal from '../../components/Home/GetInModal';
import MintModal from '../../components/IndexPage/MintModal';
import RedeemModal from '../../components/IndexPage/RedeemModal';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store/store';

interface IIndexId {
  indexId: string;
}
export interface IIndex {
  id: number;
  name: string;
  tokens: Array<IToken>;
  created_at: Date | string;
  rebalance_date?: Date | string;
}

const Index: React.FC = observer(() => {
  const { indexId } = useParams<IIndexId>();
  const { modals } = useMst();
  const [indexData, setIndexData] = useState<IIndex | undefined>();

  const getCurrentIndex = useCallback(() => {
    indexesApi.getIndexById(+indexId).then(({ data }) => {
      setIndexData(data);
      console.log('getIndexes', data);
    });
  }, [indexId]);
  const handleMint = () => {
    modals.mint.open();
  };
  const handleRedeem = () => {
    modals.redeem.open();
  };
  useEffect(() => {
    getCurrentIndex();
  }, [getCurrentIndex]);
  return (
    <main className="container page">
      <div className="page__title-row">
        <div className="page__title-icon page__title-icon--index">
          <img src={logo} alt="logo" width="31" height="28" />
        </div>

        <div className="page__title-wrapper">
          <h1 className="page__title text-outline">{indexData?.name}</h1>
        </div>
      </div>

      <TokenPanel
        panelContent={[
          {
            label: 'Inception Date',
            value: moment(indexData?.created_at ?? moment())
              .format('DD.MM.YYYY')
              .toString(),
          },
        ]}
        handleBuy={handleMint}
        handleSell={handleRedeem}
      />
      <RebalanceHistory lastRebalance={indexData?.rebalance_date} />
      <IndexTable tokens={indexData?.tokens} />
      {/* <About /> */}
      <GetInModal />
      <MintModal />
      <RedeemModal />
    </main>
  );
});

export default Index;
