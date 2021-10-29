import BigNumber from 'bignumber.js/bignumber';

export const fromWeiToNormal = (amount: string | number, decimals = 18) => {
  return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals)).toFixed(18, 1);
};
