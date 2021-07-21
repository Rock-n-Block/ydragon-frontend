import moment from 'moment';

/**
 * @param {string} dateA - a date, represented in string format
 * @param {string} dateB - a date, represented in string format
 */
const dateSort = (dateA: string, dateB: string) => moment(dateA).diff(moment(dateB));

/**
 *
 * @param {number|string} a
 * @param {number|string} b
 */
const defaultSort = (a: number | string, b: number | string) => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

const name = (a: any, b: any) => {
  const name1 = a.name.name;
  const name2 = b.name.name;
  return name1.localeCompare(name2);
};

const marketCap = (a: any, b: any) => {
  const cap1 = +a.cap.slice(1);
  const cap2 = +b.cap.slice(1);
  if (cap1 < cap2) return -1;
  if (cap2 < cap1) return 1;
  return 0;
};

const price = (a: any, b: any) => {
  const price1 = +a.price.slice(1);
  const price2 = +b.price.slice(1);
  if (price1 < price2) return -1;
  if (price2 < price1) return 1;
  return 0;
};

export const Sorter = {
  DEFAULT: defaultSort,
  DATE: dateSort,
  MARKET: marketCap,
  PRICE: price,
  NAME: name,
};
