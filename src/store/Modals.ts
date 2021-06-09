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
const GetInModal = types
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
const TradeYDRModal = types
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
const InfoModal = types
  .model({
    type: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    msg: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setMsg(title: string, msg: string, type: 'success' | 'error' | 'info') {
      self.msg = msg;
      self.title = title;
      self.type = type;
    },
    close() {
      self.msg = '';
      self.title = '';
      self.type = 'info';
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

export const Modals = types
  .model({
    rebalance: RebalanceModal,
    getIn: GetInModal,
    mint: MintModal,
    redeem: RedeemModal,
    info: InfoModal,
    tradeYDR: TradeYDRModal,
    metamask: MetamaskModal,
  })
  .actions((self) => ({
    closeAll() {
      self.metamask.close();
      self.getIn.close();
      self.mint.close();
      self.redeem.close();
      self.tradeYDR.close();
      self.rebalance.close();
    },
  }));
