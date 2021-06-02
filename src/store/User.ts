import { applySnapshot, types } from 'mobx-state-tree';

export const User = types
  .model({
    address: types.string,
    token: types.string,
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
      delete localStorage.yd_token;
      delete localStorage.yd_metamask;
    };
    return {
      setAddress,
      setToken,
      update,
      disconnect,
    };
  });
