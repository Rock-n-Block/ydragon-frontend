import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { Modals } from './Modals';
import { User } from './User';
import { Theme } from './Theme';

const RootModel = types.model({
  modals: Modals,
  user: User,
  theme: Theme,
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
    value: localStorage.theme ?? '',
  },
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
