import { applySnapshot, types } from 'mobx-state-tree';

export const BannerIme = types
  .model({
    id: types.maybeNull(types.number),
    address: types.maybeNull(types.string),
  })
  .actions((self) => {
    const setId = (id: number) => {
      self.id = id;
    };
    const setAddress = (addr: string) => {
      self.address = addr;
    };
    const update = (userData: any) => {
      applySnapshot(self, userData);
    };
    return {
      setAddress,
      setId,
      update,
    };
  });
