import { applySnapshot, types } from 'mobx-state-tree';

const Coin = types.model({
  name: types.string,
  symbol: types.string,
  image: types.string,
  coin_node: types.string,
  address: types.string,
});
const Token = types.model({
  coin: Coin,
  rate: types.string,
  updated_at: types.string,
});

export const NetworkTokens = types
  .model({
    tokens: types.array(Token),
  })
  .actions((self) => {
    const setTokens = (tokens: any) => {
      self.tokens = tokens;
    };
    const getTokenAddress = (symbol: string) => {
      return self.tokens.find((token) => token.coin.symbol.toLowerCase() === symbol.toLowerCase())
        ?.coin.address;
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
