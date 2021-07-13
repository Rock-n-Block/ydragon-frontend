import { applySnapshot, types } from 'mobx-state-tree';

export const Networks = types.model({ networkId: types.string }).actions((self) => {
  const setNetworkId = (networkId: string) => {
    self.networkId = networkId;
  };
  const update = (networkData: any) => {
    applySnapshot(self, networkData);
  };
  return {
    setNetworkId,
    update,
  };
});
