import axios from '../../core/axios';

const baseUrl = 'https://bridge.ydragon.io/api/v1/';

export default {
  getInfo: () => axios.get(`${baseUrl}networks`),
  getEthGasPrice: () => axios.get(`${baseUrl}gas/Ethereum`),
  getBscGasPrice: () => axios.get(`${baseUrl}gas/Binance-Smart-Chain`),
};
