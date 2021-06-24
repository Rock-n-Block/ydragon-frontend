import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { BannerIme } from './BannerIme';
import { Modals } from './Modals';
import { User } from './User';

const RootModel = types.model({
  modals: Modals,
  user: User,
  ime: BannerIme,
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
  },
  user: {
    address: '',
    token: '',
  },
  ime: {
    id: null,
    address: null,
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
