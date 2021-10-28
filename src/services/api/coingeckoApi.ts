import axios from '../../core/axios';

export default {
  getYDRTokensChart: (days: string) =>
    axios.get('https://api.coingecko.com/api/v3/coins/ydragon/market_chart', {
      params: {
        vs_currency: 'usd',
        days,
      },
    }),
  getYdrCurrentPrice: (): Promise<{ data: { ydragon: { usd: string } } }> =>
    axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'ydragon',
        vs_currencies: 'usd',
      },
    }),
};
