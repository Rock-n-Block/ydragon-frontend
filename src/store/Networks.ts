import { applySnapshot, types } from 'mobx-state-tree';
import { BACKEND_NETWORKS } from '../config';
import { chainsEnum } from '../types';

const Network = types.model({
  id: types.number,
  name: types.string,
  fabric_address: types.string,
  oracle_address: types.string,
  staking_address: types.string,
  router_address: types.string,
  dex_factory_address: types.string,
  endpoint: types.string,
  needs_middleware: types.boolean,
});

export const Networks = types
  .model({
    networkId: types.string,
    currentNetwork: types.string,
    networksList: types.optional(types.array(Network), []),
  })
  .actions((self) => {
    const setNetworkId = (networkId: string) => {
      self.networkId = networkId;
    };
    const setCurrNetwork = (name: string) => {
      self.currentNetwork = name;
    };
    const getCurrNetwork = () => {
      return self.networksList.find(
        (network) => network.name === BACKEND_NETWORKS[self.currentNetwork as chainsEnum],
      );
    };
    const setNetworks = (networks: any) => {
      self.networksList = networks;
    };
    const update = (networkData: any) => {
      applySnapshot(self, networkData);
    };
    return {
      setNetworkId,
      setCurrNetwork,
      getCurrNetwork,
      setNetworks,
      update,
    };
  });
