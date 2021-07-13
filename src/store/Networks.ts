import { applySnapshot, types } from 'mobx-state-tree';

const Network = types.model({
  id: types.number,
  name: types.string,
  fabric_address: types.string,
  oracle_address: types.string,
  staking_address: types.string,
  endpoint: types.string,
  needs_middleware: types.boolean,
});

export const Networks = types
  .model({
    networkId: types.string,
    networksList: types.optional(types.array(Network), []),
  }).actions((self) => {
  const setNetworkId = (networkId: string) => {
    self.networkId = networkId;
  };
    const setNetworks = (networks: any) => {
      self.networksList = networks;
    };
  const update = (networkData: any) => {
    applySnapshot(self, networkData);
  };
  return {
    setNetworkId,
    setNetworks,
    update,
  };
});
