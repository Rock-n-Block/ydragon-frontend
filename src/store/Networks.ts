import { applySnapshot, types } from 'mobx-state-tree';

export const Networks = types.model({ id: types.string }).actions((self) => {
  const setId = (id: string) => {
    self.id = id;
  };
  const update = (networkData: any) => {
    applySnapshot(self, networkData);
  };
  return {
    setId,
    update,
  };
});
