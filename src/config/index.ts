import md from '../assets/img/socials/medium.svg';
import nomics from '../assets/img/socials/nomics.png';
import tg from '../assets/img/socials/telegram.svg';
import tw from '../assets/img/socials/twitter.svg';
import coingecko from '../assets/img/socials/coingecko.svg';
import coinmarketcapL from '../assets/img/socials/coinmarketcap-light.svg';
import coinmarketcapD from '../assets/img/socials/coinmarketcap.svg';
import bncDark from '../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../assets/img/icons/icon-binance-light.svg';
import avalancheLogo from '../assets/img/icons/icon-avalanche.svg';
// import plgDark from '../assets/img/icons/icon-polygon-dark.svg';
// import plgLight from '../assets/img/icons/icon-polygon-light.svg';
import eth from '../assets/img/icons/blockchains/eth.svg';

const IS_PRODUCTION = false;
const BACKEND_URL = IS_PRODUCTION
  ? 'https://ydragon.io/api/'
  : 'https://dev-ydragon.rocknblock.io/api/';
const SOCIAL_LINKS = {
  twitter: {
    url: 'https://twitter.com/ydragons_',
    iconLight: '',
    iconDark: tw,
  },
  tgChannel: {
    url: 'https://t.me/ydrmain/',
    iconLight: '',
    iconDark: tg,
  },
  tgChat: {
    url: 'https://t.me/ydragonchat',
    iconLight: '',
    iconDark: tg,
  },
  medium: {
    url: 'https://medium.com/ydragon-io',
    iconLight: '',
    iconDark: md,
  },
  coinMarketCap: {
    url: 'https://coinmarketcap.com/currencies/ydragon/',
    iconLight: coinmarketcapL,
    iconDark: coinmarketcapD,
  },
  coingecko: {
    url: 'https://www.coingecko.com/en/coins/ydragon',
    iconLight: '',
    iconDark: coingecko,
  },
  nomics: {
    url: 'https://nomics.com/assets/ydr-ydragon',
    iconLight: '',
    iconDark: nomics,
  },
};

export type TChain = 'eth' | 'bnb' | 'avalanche' /* | 'matic' */;
const MAX_ATTEMPT_GET_BALANCE = 5;
const MS_RETRY_GET_BALANCE = 1500;
const NETWORK_TOKENS = {
  eth: {
    symbol: 'eth',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Ethereum',
    image: (theme: string) => {
      return theme === 'dark' ? eth : eth;
    },
    disabled: false,
  },
  bnb: {
    symbol: 'bnb',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Binance Coin',
    image: (theme: string) => {
      return theme === 'dark' ? bncDark : bncLight;
    },
    disabled: false,
  },
  avalanche: {
    symbol: 'avax',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Avalanche Coin',
    image: (theme: string) => {
      return theme === 'dark' ? avalancheLogo : avalancheLogo;
    },
    disabled: false,
  },
  // matic: {
  //   symbol: 'matic',
  //   address: '0x0000000000000000000000000000000000000000',
  //   decimals: 18,
  //   name: 'Polygon (Matic)',
  //   image: (theme: string) => {
  //     return theme === 'dark' ? plgDark : plgLight;
  //   },
  //   disabled: false,
  // },
};

export default {
  IS_PRODUCTION,
  BACKEND_URL,
  SOCIAL_LINKS,
  MAX_ATTEMPT_GET_BALANCE,
  MS_RETRY_GET_BALANCE,
  NETWORK_TOKENS,
  INFURA_KEY: 'e15330fb7e954a868e15297dd74dea37',
  EXPLORERS: {
    eth: IS_PRODUCTION ? 'https://etherscan.io/' : 'https://kovan.etherscan.io/',
    bnb: IS_PRODUCTION ? 'https://bscscan.com/' : 'https://testnet.bscscan.com/',
    avalanche: IS_PRODUCTION
      ? 'https://cchain.explorer.avax.network'
      : 'https://cchain.explorer.avax-test.network',
    // matic: IS_PRODUCTION ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com',
  },
  SWAP_URLS: {
    eth: 'https://app.uniswap.org/#/add/',
    bnb: 'https://pancakeswap.finance/add/',
    avalanche: 'https://app.partyswap.io/#/home',
  },
  BACKEND_NETWORKS: {
    eth: 'ethereum',
    bnb: 'binance-smart-chain',
    avalanche: 'avalanche',
    // matic: 'polygon-pos',
  },
  CHAIN_IDS: {
    mainnet: {
      eth: {
        name: 'Ethereum',
        id: '0x1',
      },
      bnb: {
        name: 'Binance smart chain',
        id: '0x38',
      },
      avalanche: {
        name: 'Avalanche',
        id: '0xa86a',
      },
      // matic: {
      //   name: 'Matic',
      //   id: '0x89',
      // },
    },
    testnet: {
      eth: {
        name: 'Ethereum',
        id: '0x2a',
      },
      bnb: {
        name: 'Binance smart chain',
        id: '0x61',
      },
      avalanche: {
        name: 'Avalanche Fuji Testnet',
        id: '0xa869',
      },
      // matic: {
      //   name: 'Matic',
      //   id: '0x13881',
      // },
    },
  },
  NETWORK_BY_CHAIN_ID: {
    mainnet: {
      '0x1': 'eth',
      '0x38': 'bnb',
      '0xa86a': 'avalanche',
      // '0x89': 'matic',
    },
    testnet: {
      '0x2a': 'eth',
      '0x61': 'bnb',
      '0xa869': 'avalanche',
      // '0x13881': 'matic',
    },
  },
  NATIVE_TOKENS: {
    eth: { native: 'eth', wrapped: 'weth' },
    bnb: { native: 'bnb', wrapped: 'wbnb' },
    avalanche: { native: 'avax', wrapped: 'wavax' },
    // matic: { native: 'matic', wrapped: 'wmatic' },
  },
  FULL_CHAIN_INFO: {
    mainnet: {
      eth: {
        chainId: '0x1',
        chainName: 'Ethereum',
        shortName: 'Ethereum',
        nativeCurrency: NETWORK_TOKENS.eth,
        rpcUrls: [
          'https://bsc-dataseed.binance.org/',
          'https://bsc-dataseed1.defibit.io/',
          'https://bsc-dataseed1.ninicoin.io/',
        ],
        blockExplorerUrls: ['https://etherscan.io/'],
      },
      bnb: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        shortName: 'Binance',
        nativeCurrency: NETWORK_TOKENS.bnb,
        rpcUrls: ['https://bsc-dataseed1.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
      avalanche: {
        chainId: '0xa86a',
        chainName: 'Avalanche',
        shortName: 'Avalanche',
        nativeCurrency: NETWORK_TOKENS.avalanche,
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://cchain.explorer.avax.network'],
      },
      // matic: {
      //   chainId: '0x89',
      //   chainName: 'Matic(Polygon) Mainnet',
      //   shortName: 'Polygon',
      //   nativeCurrency: NETWORK_TOKENS.matic,
      //   rpcUrls: ['https://rpc-mainnet.matic.network'],
      //   blockExplorerUrls: ['https://polygonscan.com'],
      // },
    },
    testnet: {
      eth: {
        chainId: '0x2a',
        chainName: 'Kovan Test Network',
        shortName: 'Ethereum Testnet',
        nativeCurrency: NETWORK_TOKENS.eth,
        rpcUrls: ['https://kovan.infura.io'],
        blockExplorerUrls: ['https://kovan.etherscan.io/'],
      },
      bnb: {
        chainId: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        shortName: 'Binance Testnet',
        nativeCurrency: NETWORK_TOKENS.bnb,
        rpcUrls: [
          'https://data-seed-prebsc-1-s1.binance.org:8545/',
          'https://data-seed-prebsc-2-s1.binance.org:8545/',
          'https://data-seed-prebsc-1-s2.binance.org:8545/',
          'https://data-seed-prebsc-2-s2.binance.org:8545/',
          'https://data-seed-prebsc-1-s3.binance.org:8545/',
          'https://data-seed-prebsc-2-s3.binance.org:8545/',
        ],
        blockExplorerUrls: ['https://testnet.bscscan.com'],
      },
      avalanche: {
        chainId: '0xa869',
        chainName: 'Avalanche Fuji Testnet',
        shortName: 'Avalanche Testnet',
        nativeCurrency: NETWORK_TOKENS.avalanche,
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://cchain.explorer.avax-test.network'],
      },
      // matic: {
      //   chainId: '0x13881',
      //   chainName: 'Matic Testnet Mumbai',
      //   shortName: 'Polygon Testnet',
      //   nativeCurrency: NETWORK_TOKENS.matic,
      //   rpcUrls: ['https://rpc-mumbai.matic.today'],
      //   blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      // },
    },
  },
};

export const BLOCKS_PER_YEAR = {
  bnb: 10512000,
  eth: 2102400,
  avalanche: 2102400, // TODO: change block number
};
