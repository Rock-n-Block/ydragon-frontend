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
    id: types.string,
    networksList: types.optional(types.array(Network), []),
  })
  .actions((self) => {
    const setId = (id: string) => {
      self.id = id;
    };
    const setNetworks = (networks: any) => {
      self.networksList = networks;
    };
    const update = (networkData: any) => {
      applySnapshot(self, networkData);
    };
    return {
      setId,
      setNetworks,
      update,
    };
  });
