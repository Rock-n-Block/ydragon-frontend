import axios from '../../core/axios';

export default {
  getYDRTokensChart: (days: string) =>
    axios.get(
      `https://api.coingecko.com/api/v3/coins/rubic/market_chart?vs_currency=usd&days=${days}`,
    ),
};
