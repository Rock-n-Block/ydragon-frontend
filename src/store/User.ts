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
      localStorage.setItem('ydr_token', '');
      localStorage.setItem('ydr_address', '');
    };
    return {
      setAddress,
      setToken,
      update,
      disconnect,
    };
  })
  .views((self) => ({
    get isUser() {
      return !!self.address || !!localStorage.getItem('ydr_address');
    },
    get isAdmin() {
      return !!self.token || !!localStorage.getItem('ydr_token');
    },
  }));
