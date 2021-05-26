import {  types } from 'mobx-state-tree';


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
  metamask:MetamaskModal
}).actions((self)=>({
  closeAll(){
    self.metamask.close();
  }
}));
