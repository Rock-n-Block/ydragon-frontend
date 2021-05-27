import {  types } from 'mobx-state-tree';


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
const MetamaskModal = types.model({
  errMsg: types.optional(types.string, ''),
}).actions((self) => ({
  setErr(err: string) {
    self.errMsg = err;
  },
  close() {
    self.errMsg = '';
  },
}));

export const Modals=types.model({
  rebalance:RebalanceModal,
  metamask:MetamaskModal
}).actions((self)=>({
  closeAll(){
    self.metamask.close();
    self.rebalance.close();
  }
}));
