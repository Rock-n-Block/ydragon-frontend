import { applySnapshot, types } from 'mobx-state-tree';

const Token = types.model({
  symbol: types.string,
  address: types.string,
  decimals: types.number,
  name: types.string,
  image: types.string,
});

export const BasicTokens = types
  .model({
    tokensList: types.optional(types.array(Token), []),
  })
  .actions((self) => {
    /* const getToken = (token:IBaseToken) => {
      return self.tokensList.find((token) => network.name === self.currentNetwork);
    }; */

    const setTokens = (tokens: any) => {
      self.tokensList = tokens;
    };
    const getTokenAddress = (symbol: string) => {
      return self.tokensList.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase())
        ?.address;
    };
    const update = (networkData: any) => {
      applySnapshot(self, networkData);
    };
    return {
      setTokens,
      getTokenAddress,
      update,
    };
  });
