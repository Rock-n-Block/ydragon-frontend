import { applySnapshot, types } from 'mobx-state-tree';

export const Theme = types
  .model({
    value: types.string,
  })
  .actions((self) => {
    const setTheme = (thm: string) => {
      self.value = thm;
      localStorage.theme = thm;
    };
    const update = (themeData: any) => {
      applySnapshot(self, themeData);
    };
    return {
      setTheme,
      update,
    };
  });
