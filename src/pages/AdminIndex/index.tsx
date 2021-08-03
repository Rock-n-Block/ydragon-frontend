import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store/store';

import {
  Composition,
  IndexInfo,
  Options,
  Rebalance,
  TokensStructure,
  XYStructure,
} from '../../components/Admin';
import { RebalanceModal } from '../../components/Modals';
import { indexesApi, vaultsApi } from '../../services/api';
import { IIndex, IIndexStatus, ITokensDiff } from '../Admin';

interface IIndexId {
  indexId: string;
}

interface IRebalance extends IIndexStatus {
  index: IIndex;
  tokens_diff: Array<ITokensDiff>;
  id: number;
  term: number;
  attempts_count: number;
  market_cap: number;
  price: number;
  network: string;
}
export interface IVault {
  id: number;
  apr: null | string;
  token_name: string;
  token_image: string;
  x_balance: string;
  y_balance: string;
  farm_balance: string;
  x_percent: string;
  y_percent: string;
  farm_percent: string;
}
export interface IVaultMini {
  currency: string;
  total_x: string;
  total_y: string;
}
const AdminIndex: React.FC = () => {
  const { indexId } = useParams<IIndexId>();
  const [index, setIndex] = useState<IRebalance>({} as IRebalance);
  const [vault, setVault] = useState<IVault[]>([] as IVault[]);
  const [vaultMini, setVaultMini] = useState<IVaultMini[]>([] as IVaultMini[]);
  const [manualRebalanceValue, setManualRebalanceValue] = useState<string>('');
  const { networks } = useMst();
  const history = useHistory();

  const handleManualRebalanceValueChange = (value: string) => {
    setManualRebalanceValue(value);
  };
  const getIndexComposition = useCallback(() => {
    // TODO: change indexId dynamically
    indexesApi
      .getIndexesRebalance(+indexId)
      .then(({ data }) => {
        setIndex(data);
        if (networks.currentNetwork !== data.index.network) {
          history.push('/admin');
        }
      })
      .catch((err) => {
        const { response } = err;
        console.log('get index composition collections error', response);
      });
  }, [indexId, history, networks.currentNetwork]);

  const getVaults = useCallback(() => {
    vaultsApi
      .getVaults(+indexId)
      .then(({ data }) => {
        const vaults = data.splice(-2, 2);
        setVault(data);
        setVaultMini(vaults);
      })
      .catch((err) => {
        const { response } = err;
        console.log('get vaults collections error', response);
      });
  }, [indexId]);
  useEffect(() => {
    if (networks.currentNetwork) {
      getIndexComposition();
    }
  }, [networks.currentNetwork, getIndexComposition]);
  useEffect(() => {
    if (networks.currentNetwork) {
      getVaults();
    }
  }, [networks.currentNetwork, getVaults]);
  return (
    <main className="container">
      <IndexInfo marketCap={index.market_cap} price={index.price} />
      <Composition status={index.status} tokens={index.tokens_diff} />
      <Rebalance tokens={index.tokens_diff} />
      <Options
        address={index.index?.address}
        onManualInputChange={handleManualRebalanceValueChange}
      />
      <TokensStructure vaults={vault} manualRebalanceValue={manualRebalanceValue} />
      <XYStructure vaults={vaultMini} />
      <RebalanceModal
        name={index.index?.name}
        tokens={index.tokens_diff}
        onStart={getIndexComposition}
      />
    </main>
  );
};

export default observer(AdminIndex);
