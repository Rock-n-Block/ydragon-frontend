import BigNumber from 'bignumber.js/bignumber';

export const formatAmount = (amount: string | number, decimals = 6) => {
  if (amount === '0') return '0';
  return new BigNumber(amount).toFormat(decimals);
};
