import { applySnapshot, types } from 'mobx-state-tree';

export const User = types
  .model({
    address: types.string,
    token: types.optional(types.string, ''),
  })
  .actions((self) => {
    const setAddress = (addr: string) => {
      self.address = addr;
    };
    const setToken = (token: string) => {
      self.token = token;
    };
    const update = (userData: any) => {
      applySnapshot(self, userData);
    };
    const disconnect = () => {
      self.address = '';
      sessionStorage.setItem('yd_token', '');
      sessionStorage.setItem('yd_wallet', '');
      sessionStorage.setItem('yd_address', '');
    };
    return {
      setAddress,
      setToken,
      update,
      disconnect,
    };
  });
