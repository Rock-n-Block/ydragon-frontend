import { types } from 'mobx-state-tree';

const RebalanceModal = types
  .model({
    isOpen: types.boolean,
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));
const CreateIndexModal = types
  .model({
    isOpen: types.boolean,
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));
const GetInModal = types
  .model({
    id: types.maybeNull(types.number),
    address: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
  })
  .actions((self) => ({
    open(id: number, address: string, name: string) {
      self.id = id;
      self.address = address;
      self.name = name;
    },
    close() {
      self.id = null;
      self.address = null;
      self.name = null;
    },
  }));
const MintModal = types
  .model({
    isOpen: types.boolean,
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));
const TradeIndexModal = types
  .model({
    isOpen: types.boolean,
    method: types.string,
  })
  .actions((self) => ({
    open(method: 'sell' | 'buy') {
      self.isOpen = true;
      self.method = method;
    },
    close() {
      self.isOpen = false;
    },
  }));
const RedeemModal = types
  .model({
    isOpen: types.boolean,
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));
const MetamaskModal = types
  .model({
    errMsg: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setErr(err: string) {
      self.errMsg = err;
    },
    close() {
      self.errMsg = '';
    },
  }));
const ConnectWalletModal = types
  .model({
    isOpen: types.boolean,
    redirectRouteAfterLogin: types.optional(types.string, ''),
  })
  .actions((self) => ({
    open(redirectRoute?: string) {
      self.isOpen = true;
      self.redirectRouteAfterLogin = redirectRoute || '';
    },
    close() {
      self.isOpen = false;
    },
  }));

export const Modals = types
  .model({
    rebalance: RebalanceModal,
    createIndex: CreateIndexModal,
    getIn: GetInModal,
    mint: MintModal,
    redeem: RedeemModal,
    tradeIndex: TradeIndexModal,
    metamask: MetamaskModal,
    connectWallet: ConnectWalletModal,
  })
  .actions((self) => ({
    closeAll() {
      self.metamask.close();
      self.getIn.close();
      self.mint.close();
      self.redeem.close();
      self.tradeIndex.close();
      self.rebalance.close();
      self.createIndex.close();
      self.connectWallet.close();
    },
  }));
