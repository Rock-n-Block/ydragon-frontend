import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import logo from '../../assets/img/icons/logo.svg';
import { GradientText, TokenPanel } from '../../components';
import { IndexTable, RebalanceHistory } from '../../components/IndexPage';
import { IToken } from '../../components/IndexPage/IndexTable';
import { indexesApi } from '../../services/api';

import './Index.scss';
import GetInModal from '../../components/Home/GetInModal';

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

const Index: React.FC = () => {
  const { indexId } = useParams<IIndexId>();
  const [indexData, setIndexData] = useState<IIndex | undefined>();

  const getCurrentIndex = useCallback(() => {
    indexesApi.getIndexById(+indexId).then(({ data }) => {
      setIndexData(data);
      console.log('getIndexes', data);
    });
  }, [indexId]);
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
          <h1 className="page__title">
            <GradientText width="434" height="38" text={`${indexData?.name}`} />
          </h1>
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
      />
      <RebalanceHistory lastRebalance={indexData?.rebalance_date} />
      <IndexTable tokens={indexData?.tokens} />
      {/* <About /> */}
      <GetInModal />
    </main>
  );
};

export default Index;
