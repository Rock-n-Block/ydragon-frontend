import BigNumber from 'bignumber.js/bignumber';

export const formatAmount = (amount: string | number, decimals = 18) => {
  console.log({ amount });

  if (amount === '0' || amount === '0.000000000000000000') return '0';
  return new BigNumber(amount).toFormat(decimals);
};
