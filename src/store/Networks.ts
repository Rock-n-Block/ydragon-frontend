import { applySnapshot, types } from 'mobx-state-tree';

export const Networks = types.model({ network: types.string }).actions((self) => {
  const setNetwork = (network: 'bnbt' | 'tmatic') => {
    self.network = network;
  };
  const update = (networkData: any) => {
    applySnapshot(self, networkData);
  };
  return {
    setNetwork,
    update,
  };
});
