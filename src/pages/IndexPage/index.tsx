import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { useHistory, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import logo from '../../assets/img/icons/logo.svg';
import { TokenPanel } from '../../components';
import { IndexChart, IndexTable } from '../../components/IndexPage';
import { IFetchedData } from '../../components/IndexPage/IndexChart';
import { IHistoricalToken, IToken } from '../../components/IndexPage/IndexTable';
import { TradeIndexModal } from '../../components/Modals';
import SmallTableCard from '../../components/SmallTableCard/index';
import { indexesApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';

import './Index.scss';
import { BACKEND_NETWORKS } from '../../config';
import { chainsEnum } from '../../types';

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
  total_supply: string;
  tokens: Array<IToken>;
  created_at: Date | string;
  rebalance_date?: Date | string;
  price: number;
  daily_change: number;
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
        if (BACKEND_NETWORKS[networks.currentNetwork as chainsEnum] !== data.network) {
          history.push('/indexes');
        }
      })
      .catch((err: any) => {
        history.push('/*');
        console.error('get current index error', err);
      });
  }, [indexId, networks.currentNetwork, history]);

  const getUserBalance = useCallback(
    (indexAddress: string) => {
      walletConnector.walletService.getBalanceOf(indexAddress).then((data: string) => {
        setBalance(
          new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(+data === 0 ? 2 : 7),
        );
      });
    },
    [walletConnector.walletService],
  );

  const updateData = () => {
    if (indexData && user.address) {
      getUserBalance(indexData.address);
      getCurrentIndex();
    }
  };

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
            label: 'Market Cap (TVL)',
            value: `$${new BigNumber(indexData?.market_cap ?? 0).toFixed(2)}`,
          },
          {
            label: 'Total Supply',
            value: `${new BigNumber(indexData?.total_supply ?? 0).toFixed(2)}`,
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
        tradeInfo={{ address: indexData?.address, symbol: indexData?.name }}
        handleBuy={handleBuy}
        handleSell={handleSell}
        needLogin
      />
      <IndexChart onClick={setTableTokens} indexId={indexId} diff={indexData?.daily_change || 0} />
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
                  ['Quantity in Index', `${new BigNumber(token.repr_count).toFixed(2)}`],
                  ['Token Price', `$${token.rate}`],
                  [
                    'Current Weight',
                    `${new BigNumber(token.weight).multipliedBy(100).toFixed(2)}%`,
                  ],
                  [
                    'Percent Change',
                    `${new BigNumber('percent_change' in token ? token.percent_change : 0).toFixed(
                      2,
                    )}%`,
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
                    'Quantity in Index',
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
      {/* <RebalanceHistory lastRebalance={indexData?.rebalance_date} /> */}
      {/* <About /> */}
      <TradeIndexModal
        token={indexData?.name ?? ''}
        tokenId={indexData?.id ?? 0}
        indexAddress={indexData?.address ?? ''}
        updateData={updateData}
      />
    </main>
  );
});

export default Index;
