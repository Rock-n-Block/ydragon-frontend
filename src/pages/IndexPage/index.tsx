import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { useHistory, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import logo from '../../assets/img/icons/logo.svg';
import { TokenPanel } from '../../components';
import { IndexChart, IndexTable, RebalanceHistory } from '../../components/IndexPage';
import { IHistoricalToken, IToken } from '../../components/IndexPage/IndexTable';
import { TradeIndexModal } from '../../components/Modals';
import SmallTableCard from '../../components/SmallTableCard/index';
import { indexesApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';

import './Index.scss';
import { IFetchedData } from '../../components/IndexPage/IndexChart';

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
  const walletConnector = useWalletConnectorContext();
  const { modals, networks, user } = useMst();
  const history = useHistory();
  const [tokens, setTokens] = useState<Array<IHistoricalToken>>();
  const [balance, setBalance] = useState<string>('0');
  const [indexData, setIndexData] = useState<IIndex | undefined>();

  const setTableTokens = (value: IFetchedData) => {
    setTokens(value.tokens_history);
  };

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

  const getUserBalance = useCallback(
    (indexAddress: string) => {
      walletConnector.metamaskService.getBalanceOf(indexAddress).then((data: string) => {
        setBalance(new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(7));
      });
    },
    [walletConnector.metamaskService],
  );

  const handleBuy = () => {
    modals.tradeIndex.open('buy');
  };
  const handleSell = () => {
    modals.tradeIndex.open('sell');
  };

  useEffect(() => {
    if (indexData && user.address) {
      getUserBalance(indexData.address);
    }
  }, [user.address, getUserBalance, indexData]);
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
          {
            label: 'Your balance',
            value: balance,
          },
        ]}
        handleBuy={handleBuy}
        handleSell={handleSell}
        needLogin
      />
      <RebalanceHistory lastRebalance={indexData?.rebalance_date} />
      <IndexChart onClick={setTableTokens} indexId={indexId} />
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
                  [
                    'Current Weight',
                    `${new BigNumber(token.weight).multipliedBy(100).toFixed(2)}%`,
                  ],
                  [
                    'Percent Change',
                    `${new BigNumber('diff' in token ? token.diff : 0).toFixed(2)}%`,
                  ],
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
                  [
                    'Current Weight',
                    `${new BigNumber(token.current_weight).multipliedBy(100).toFixed(2)}%`,
                  ],
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
