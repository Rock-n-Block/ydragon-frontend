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
    const isUser = () => {
      return !!self.address;
    };
    const isAdmin = () => {
      return !!self.token;
    };
    const disconnect = () => {
      self.address = '';
      localStorage.setItem('yd_token', '');
      localStorage.setItem('yd_metamask', '');
      localStorage.setItem('yd_address', '');
    };
    return {
      setAddress,
      setToken,
      update,
      disconnect,
      isUser,
      isAdmin,
    };
  });
