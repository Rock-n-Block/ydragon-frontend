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
    metamask: MetamaskModal,
  })
  .actions((self) => ({
    closeAll() {
      self.metamask.close();
      self.getIn.close();
      self.mint.close();
      self.redeem.close();
      self.rebalance.close();
    },
  }));
