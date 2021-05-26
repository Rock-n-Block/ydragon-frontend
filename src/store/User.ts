import { applySnapshot, flow, types } from 'mobx-state-tree';

export const User = types.model({
  address: types.string,
}).actions((self) => {
  const setAddress = (addr: string) => {
    self.address = addr;
  };
  const update = (userData: any) => {
    applySnapshot(self, userData);
  };
  const disconnect = () => {
    self.address = '';
    delete localStorage.dds_token;
    delete localStorage.dds_metamask;
  };
  const getMe = flow(function* getMe() {
    try {
      const { data } = yield userApi.getMe();

      update(data);
    } catch (err) {
      console.log(err);
      disconnect();
    }
  });
  return {
    setAddress,
    update,
    disconnect,
    getMe,
  };
});
