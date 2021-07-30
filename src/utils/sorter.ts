import moment from 'moment';

/**
 * @param {string} dateA - a date, represented in string format
 * @param {string} dateB - a date, represented in string format
 * @param {boolean} asc
 */
const dateSort = (dateA: string, dateB: string, asc = true) => {
  return asc ? moment(dateA).diff(moment(dateB)) : moment(dateB).diff(moment(dateA));
};

/**
 *
 * @param {any} a
 * @param {any} b
 * @param {boolean} asc
 * @param {string} key
 */
const defaultSort = (a: any, b: any, asc = true, key: string) => {
  if (a[key] < b[key]) return asc ? -1 : 1;
  if (b[key] < a[key]) return asc ? 1 : -1;
  return 0;
};

export const Sorter = {
  DEFAULT: defaultSort,
  DATE: dateSort,
};
