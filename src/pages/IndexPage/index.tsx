import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import BigNumber from 'bignumber.js/bignumber';

import logo from '../../assets/img/icons/logo.svg';
import { TokenPanel } from '../../components';
import { IndexChart, IndexTable, RebalanceHistory } from '../../components/IndexPage';
import { IToken } from '../../components/IndexPage/IndexTable';
import { GetInIndexModal, TradeIndexModal } from '../../components/Modals';
import MintModal from '../../components/Modals/MintModal';
import RedeemModal from '../../components/Modals/RedeemModal';
import { ITableData } from '../../components/SplittedTable';
import { TokenMiniProps } from '../../components/TokenMini';
import { indexesApi } from '../../services/api';
import { useMst } from '../../store/store';
import SmallTableCard from '../../components/SmallTableCard/index';

import './Index.scss';

interface IIndexId {
  indexId: string;
}
export interface IIndex {
  id: number;
  name: string;
  address: string;
  description: string;
  market_cap: string;
  tokens: Array<IToken>;
  created_at: Date | string;
  rebalance_date?: Date | string;
}

const Index: React.FC = observer(() => {
  const { indexId } = useParams<IIndexId>();
  const { modals } = useMst();
  const [tokens, setTokens] = useState();
  const getTokens = (value: React.SetStateAction<any>) => {
    setTokens(value);
  };
  const [indexData, setIndexData] = useState<IIndex | undefined>();
  const [totalData, setTotalData] = useState<ITableData[]>([] as ITableData[]);

  const getCurrentIndex = useCallback(() => {
    indexesApi.getIndexById(+indexId).then(({ data }) => {
      setIndexData(data);
      setTotalData(
        data.tokens.map((token: IToken) => {
          return [
            {
              icon: token.image,
              name: token.name,
              symbol: token.symbol,
            } as TokenMiniProps,
            token.count,
            `$${token.price_for_one}`,
            `$${token.price_total}`,
          ];
        }),
      );
      console.log('getIndexes', data, setTotalData);
    });
  }, [indexId]);
  /* const handleMint = () => {
    modals.mint.open();
  };
  const handleRedeem = () => {
    modals.redeem.open();
  }; */
  // const handleGetIn = () => {
  //   modals.getInIndex.open();
  // };

  const handleBuy = () => {
    modals.tradeIndex.open('buy');
    // walletConnector.metamaskService.buyYDRToken().then().catch();
  };
  const handleSell = () => {
    modals.tradeIndex.open('sell');
  };

  useEffect(() => {
    getCurrentIndex();
  }, [getCurrentIndex]);

  console.log(indexData?.tokens);

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
        // handleGetIn={handleGetIn}
        handleBuy={handleBuy}
        handleSell={handleSell}
      />
      <RebalanceHistory lastRebalance={indexData?.rebalance_date} />
      <div className="index-table__big">
        <IndexTable tokens={indexData?.tokens} />
      </div>
      <div className="index-table__small">
        {indexData?.tokens.map((token, i) => (
          <SmallTableCard
            index={i}
            data={[
              [
                'Quantity per Set',
                `${new BigNumber(token.count)
                  .multipliedBy(new BigNumber(10).pow(-token.decimal))
                  .toFixed(2)}`,
              ],
              ['Token Price', `$${token.price_for_one}`],
              ['Current Weight', `${Number(token.current_weight).toFixed(2)}%`],
              ['Total Price per Set', `$${token.price_total}`],
            ]}
            headerTitle="Token"
            tokenName={token.name}
            tokenLogo={token.image}
          />
        ))}
      </div>
      <IndexChart tokens={getTokens} indexId={indexId} />
      <IndexTable tokens={tokens || indexData?.tokens} />
      {/* <About /> */}
      <TradeIndexModal token={indexData?.name ?? ''} indexAddress={indexData?.address ?? ''} />
      <MintModal />
      <RedeemModal />
      <GetInIndexModal totalData={totalData} indexAddress={indexData?.address ?? ''} />
    </main>
  );
});

export default Index;
