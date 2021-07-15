import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { Modals } from './Modals';
import { Networks } from './Networks';
import { Theme } from './Theme';
import { User } from './User';
import { NetworkTokens } from './NetworkTokens';

const RootModel = types.model({
  modals: Modals,
  user: User,
  theme: Theme,
  networks: Networks,
  networkTokens: NetworkTokens,
});

export const Store = RootModel.create({
  modals: {
    metamask: {},
    rebalance: { isOpen: false },
    createIndex: { isOpen: false },
    getIn: { id: null, address: null },
    mint: { isOpen: false },
    info: { msg: '', title: '', type: 'info' },
    redeem: { isOpen: false },
    tradeYDR: { isOpen: false, method: 'buy' },
    tradeIndex: { isOpen: false, method: 'buy' },
  },
  user: {
    address: '',
    token: '',
  },
  theme: {
    value: localStorage.theme ?? 'dark',
  },
  networks: {
    networkId: '',
    networksList: [],
  },
  networkTokens: {},
});

export const rootStore = Store;

onSnapshot(rootStore, (snapshot) => {
  console.log('Snapshoot:', snapshot);
});

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const { Provider } = RootStoreContext;

export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}
