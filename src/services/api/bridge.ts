import axios from '../../core/axios';

const baseUrl = process.env.REACT_APP_API_URL;

export default {
  getInfo: () => axios.get(`${baseUrl}networks`),
  getEthGasPrice: () => axios.get(`${baseUrl}gas/Ethereum`),
  getBscGasPrice: () => axios.get(`${baseUrl}gas/Binance-Smart-Chain`),
};
