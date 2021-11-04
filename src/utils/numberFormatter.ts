import { round } from 'lodash';

export function numberFormatter(num: number, digits: number): string {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: ' K' },
    { value: 1e6, symbol: ' M' },
    { value: 1e9, symbol: ' G' },
    { value: 1e12, symbol: ' T' },
    { value: 1e15, symbol: ' P' },
    { value: 1e18, symbol: ' E' },
  ];
  let i = si.length - 1;

  while (i > 0) {
    if (num >= si[i].value) {
      break;
    }

    i -= 1;
  }

  const resNumber = num / si[i].value;

  return `${round(resNumber, digits)}${si[i].symbol}`;
}
