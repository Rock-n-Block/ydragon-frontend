import axios from '../../core/axios';

export default {
  getInfo: () => axios.get(`networks/`),
  getEthGasPrice: () => axios.get('gas/Ethereum/'),
  getBscGasPrice: () => axios.get('gas/Binance-Smart-Chain/'),
  getAvalancheGasPrice: () => axios.get('gas/Avalanche/'),
};
