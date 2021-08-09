import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { useHistory, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import logo from '../../assets/img/icons/logo.svg';
import { TokenPanel } from '../../components';
import { IndexChart, IndexTable, RebalanceHistory } from '../../components/IndexPage';
import { ITableToken, IToken } from '../../components/IndexPage/IndexTable';
import { TradeIndexModal } from '../../components/Modals';
import SmallTableCard from '../../components/SmallTableCard/index';
import { indexesApi } from '../../services/api';
import { useMst } from '../../store/store';

import './Index.scss';

interface IIndexId {
  indexId: string;
}

export interface IIndex {
  id: number;
  name: string;
  address: string;
  network: string;
  description: string;
  market_cap: string;
  tokens: Array<IToken>;
  created_at: Date | string;
  rebalance_date?: Date | string;
}

const Index: React.FC = observer(() => {
  const { indexId } = useParams<IIndexId>();
  const { modals, networks } = useMst();
  const history = useHistory();
  const [tokens, setTokens] = useState<Array<ITableToken>>();
  const getTokens = (value: React.SetStateAction<any>) => {
    setTokens(value);
  };
  const [indexData, setIndexData] = useState<IIndex | undefined>();

  const getCurrentIndex = useCallback(() => {
    indexesApi
      .getIndexById(+indexId)
      .then(({ data }) => {
        setIndexData(data);
        if (networks.currentNetwork !== data.network) {
          history.push('/indexes');
          // console.log(history);
        }
      })
      .catch((err: any) => {
        console.log('get current index error', err);
      });
  }, [history, networks.currentNetwork, indexId]);

  const handleBuy = () => {
    modals.tradeIndex.open('buy');
  };
  const handleSell = () => {
    modals.tradeIndex.open('sell');
  };

  useEffect(() => {
    if (networks.currentNetwork) {
      getCurrentIndex();
    }
  }, [networks.currentNetwork, getCurrentIndex]);

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
            label: 'Market Cap',
            value: `$${new BigNumber(indexData?.market_cap ?? 0).toFixed(2)}`,
          },
          {
            label: 'Inception Date',
            value: moment(indexData?.created_at ?? moment())
              .format('DD.MM.YY')
              .toString(),
          },
        ]}
        handleBuy={handleBuy}
        handleSell={handleSell}
      />
      <RebalanceHistory lastRebalance={indexData?.rebalance_date} />
      <IndexChart tokens={getTokens} indexId={indexId} />
      <div className="index-table__big">
        <IndexTable tokens={tokens || indexData?.tokens} />
      </div>
      <div className="index-table__small">
        {tokens !== undefined
          ? tokens.map((token, i) => (
              <SmallTableCard
                key={nextId()}
                index={i}
                data={[
                  ['Quantity per Set', `${new BigNumber(token.repr_count).toFixed(2)}`],
                  ['Token Price', `$${token.rate}`],
                  ['Current Weight', `${Number(token.weight).toFixed(2)}%`],
                  [
                    'Total Price per Set',
                    `$${new BigNumber(token.total_price).multipliedBy(100).toFixed(0)}`,
                  ],
                ]}
                headerTitle="Token"
                tokenName={token.token_name}
                tokenLogo={token.token_image}
              />
            ))
          : indexData?.tokens.map((token, i) => (
              <SmallTableCard
                key={nextId()}
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
      {/* <About /> */}
      <TradeIndexModal
        token={indexData?.name ?? ''}
        tokenId={indexData?.id ?? 0}
        indexAddress={indexData?.address ?? ''}
      />
    </main>
  );
});

export default Index;
