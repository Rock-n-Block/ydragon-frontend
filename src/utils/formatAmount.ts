import BigNumber from 'bignumber.js/bignumber';

export const formatAmount = (amount: string | number, decimals = 18) => {
  if (new BigNumber(amount).isEqualTo(0)) return '0';
  // if (new BigNumber(amount).absoluteValue().toString() !== amount)
  //   return new BigNumber(amount).toFormat(2);
  return new BigNumber(amount).toFormat(decimals);
};
