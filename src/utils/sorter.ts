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
 * @param {number|string} a
 * @param {number|string} b
 * @param {boolean} asc
 */
const defaultSort = (a: number | string, b: number | string, asc = true) => {
  if (a < b) return asc ? -1 : 1;
  if (b < a) return asc ? 1 : -1;
  return 0;
};

export const Sorter = {
  DEFAULT: defaultSort,
  DATE: dateSort,
};
