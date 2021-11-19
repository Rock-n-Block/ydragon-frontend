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
import metamaskImg from '../assets/img/auth/metamask.svg';
import walletConnectImg from '../assets/img/auth/walletconnect.svg';
// import plgDark from '../assets/img/icons/icon-polygon-dark.svg';
// import plgLight from '../assets/img/icons/icon-polygon-light.svg';
import eth from '../assets/img/icons/blockchains/eth.svg';
import { chainsEnum, IConnectWallet, IContracts } from '../types';
import { rootStore } from '../store/store';
import { factoryAbi, routerAbi, tokenAbi } from './abi';

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

const MAX_ATTEMPT_GET_BALANCE = 5;
const MS_RETRY_GET_BALANCE = 1500;
const NETWORK_TOKENS = {
  'Ethereum': {
    symbol: 'eth',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Ethereum',
    image: (theme: string) => {
      return theme === 'dark' ? eth : eth;
    },
    disabled: false,
  },
  'Binance-Smart-Chain': {
    symbol: 'bnb',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Binance Coin',
    image: (theme: string) => {
      return theme === 'dark' ? bncDark : bncLight;
    },
    disabled: false,
  },
  'Avalanche': {
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
const INFURA_KEY = 'e15330fb7e954a868e15297dd74dea37';

const chains: {
  [key: string]: {
    name: chainsEnum;
    chainId: number;
    provider: {
      [key: string]: any;
    };
    img?: any;
    explorer: string;
  };
} = {
  [chainsEnum.Ethereum]: {
    name: chainsEnum.Ethereum,
    chainId: IS_PRODUCTION ? 1 : 42,
    img: eth,
    explorer: IS_PRODUCTION ? '' : '',
    provider: {
      MetaMask: { name: 'MetaMask', img: metamaskImg },
      WalletConnect: {
        img: walletConnectImg,
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [IS_PRODUCTION ? 1 : 42]: IS_PRODUCTION
                ? 'https://bsc-dataseed.binance.org/'
                : 'https://data-seed-prebsc-2-s1.binance.org:8545/',
            },
            chainId: IS_PRODUCTION ? 1 : 42,
          },
        },
      },
    },
  },
  [chainsEnum['Binance-Smart-Chain']]: {
    name: chainsEnum['Binance-Smart-Chain'],
    chainId: IS_PRODUCTION ? 56 : 97,
    img: (theme: string) => {
      return theme === 'dark' ? bncDark : bncLight;
    },
    provider: {
      MetaMask: { name: 'MetaMask', img: metamaskImg },
      WalletConnect: {
        img: walletConnectImg,
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [IS_PRODUCTION ? 56 : 97]: IS_PRODUCTION
                ? 'https://bsc-dataseed.binance.org/'
                : 'https://data-seed-prebsc-2-s1.binance.org:8545/',
            },
            chainId: IS_PRODUCTION ? 56 : 97,
          },
        },
      },
    },
    explorer: IS_PRODUCTION ? 'https://bscscan.com' : 'https://testnet.bscscan.com',
  },
  [chainsEnum.Avalanche]: {
    name: chainsEnum.Avalanche,
    chainId: IS_PRODUCTION ? 43114 : 43113,
    img: avalancheLogo,
    provider: {
      MetaMask: { name: 'MetaMask', img: metamaskImg },
      WalletConnect: {
        img: walletConnectImg,
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [IS_PRODUCTION ? 43114 : 43113]: IS_PRODUCTION
                ? 'https://api.avax.network/ext/bc/C/rpc'
                : 'https://api.avax-test.network/ext/bc/C/rpc',
            },
            chainId: IS_PRODUCTION ? 43114 : 43113,
          },
        },
      },
    },
    explorer: IS_PRODUCTION ? 'https://bscscan.com' : 'https://testnet.bscscan.com',
  },
  /* [chainsEnum.Polygon]: {
    name: chainsEnum.Polygon,
    chainId: IS_PRODUCTION ? 137 : 80001,
    img:  (theme: string) => {
      return theme === 'dark' ? po : bncLight;
    },
    provider: {
      MetaMask: {name: 'MetaMask', img: metamaskImg},
      WalletConnect: {
        img: walletConnectImg,
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [IS_PRODUCTION ? 137 : 80001]: IS_PRODUCTION
                ? 'https://bsc-dataseed.binance.org/'
                : 'https://data-seed-prebsc-2-s1.binance.org:8545/',
            },
            chainId: IS_PRODUCTION ? 137 : 80001,
          },
        },
      },
    },
    explorer: IS_PRODUCTION ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com',
  }, */
};

export const connectWallet = (
  chainName: chainsEnum,
): IConnectWallet & {
  blockchains: Array<string>;
} => {
  const chain = chains[chainName];

  return {
    wallets: ['MetaMask', 'WalletConnect'],
    blockchains: ['Ethereum', 'Binance Smart Chain', 'Avalanche', 'Polygon'],
    network: {
      chainName: chain.name.toString(),
      chainID: chain.chainId,
    },
    provider: chain.provider,
    settings: { providerType: true },
  };
};
export type ContractTypes = 'Router' | 'Factory' | 'Staking' | 'Token';

export const contracts: IContracts = {
  type: IS_PRODUCTION ? 'mainnet' : 'testnet',
  names: ['Router', 'Factory', 'Staking', 'Token'],
  decimals: 18,
  params: {
    Router: {
      address: rootStore.networks.getCurrNetwork()?.router_address || '',
      abi: routerAbi,
    },
    Factory: {
      address: rootStore.networks.getCurrNetwork()?.fabric_address || '',
      abi: factoryAbi,
    },
    Staking: {
      address: rootStore.networks.getCurrNetwork()?.staking_address || '',
      abi: routerAbi,
    },
    Token: {
      address: '',
      abi: tokenAbi,
    },
  },
};
export const BACKEND_NETWORKS = {
  'Ethereum': 'ethereum',
  'Binance-Smart-Chain': 'binance-smart-chain',
  'Avalanche': 'avalanche',
  // matic: 'polygon-pos',
};

export default {
  IS_PRODUCTION,
  BACKEND_URL,
  SOCIAL_LINKS,
  MAX_ATTEMPT_GET_BALANCE,
  MS_RETRY_GET_BALANCE,
  NETWORK_TOKENS,
  INFURA_KEY,
  EXPLORERS: {
    'Ethereum': IS_PRODUCTION ? 'https://etherscan.io/' : 'https://kovan.etherscan.io/',
    'Binance-Smart-Chain': IS_PRODUCTION ? 'https://bscscan.com/' : 'https://testnet.bscscan.com/',
    'Avalanche': IS_PRODUCTION
      ? 'https://cchain.explorer.avax.network'
      : 'https://cchain.explorer.avax-test.network',
    // matic: IS_PRODUCTION ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com',
  },
  SWAP_URLS: {
    'Ethereum': 'https://app.uniswap.org/#/add/',
    'Binance-Smart-Chain': 'https://pancakeswap.finance/add/',
    'Avalanche': 'https://app.partyswap.io/#/home',
  },
  CHAIN_IDS: {
    mainnet: {
      'Ethereum': {
        name: 'Ethereum',
        id: '0x1',
      },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain',
        id: '0x38',
      },
      'Avalanche': {
        name: 'Avalanche',
        id: '0xa86a',
      },
      // matic: {
      //   name: 'Matic',
      //   id: '0x89',
      // },
    },
    testnet: {
      'Ethereum': {
        name: 'Ethereum',
        id: '0x2a',
      },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain',
        id: '0x61',
      },
      'Avalanche': {
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
      '0x1': 'Ethereum',
      '0x38': 'Binance-Smart-Chain',
      '0xa86a': 'Avalanche',
      // '0x89': 'matic',
    },
    testnet: {
      '0x2a': 'Eth',
      '0x61': 'Binance-Smart-Chain',
      '0xa869': 'Avalanche',
      // '0x13881': 'matic',
    },
  },
  NATIVE_TOKENS: {
    'Ethereum': { native: 'eth', wrapped: 'weth' },
    'Binance-Smart-Chain': { native: 'bnb', wrapped: 'wbnb' },
    'Avalanche': { native: 'avax', wrapped: 'wavax' },
    // matic: { native: 'matic', wrapped: 'wmatic' },
  },
  FULL_CHAIN_INFO: {
    mainnet: {
      'Ethereum': {
        chainId: '0x1',
        chainName: 'Ethereum',
        shortName: 'Ethereum',
        nativeCurrency: NETWORK_TOKENS.Ethereum,
        rpcUrls: [`https://mainnet.infura.io/v3/${INFURA_KEY}`],
        blockExplorerUrls: ['https://etherscan.io/'],
      },
      'Binance-Smart-Chain': {
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        shortName: 'Binance',
        nativeCurrency: NETWORK_TOKENS['Binance-Smart-Chain'],
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
      'Avalanche': {
        chainId: '0xa86a',
        chainName: 'Avalanche',
        shortName: 'Avalanche',
        nativeCurrency: NETWORK_TOKENS.Avalanche,
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
      'Ethereum': {
        chainId: '0x2a',
        chainName: 'Kovan Test Network',
        shortName: 'Ethereum Testnet',
        nativeCurrency: NETWORK_TOKENS.Ethereum,
        rpcUrls: ['https://kovan.infura.io'],
        blockExplorerUrls: ['https://kovan.etherscan.io/'],
      },
      'Binance-Smart-Chain': {
        chainId: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        shortName: 'Binance Testnet',
        nativeCurrency: NETWORK_TOKENS['Binance-Smart-Chain'],
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
      'Avalanche': {
        chainId: '0xa869',
        chainName: 'Avalanche Fuji Testnet',
        shortName: 'Avalanche Testnet',
        nativeCurrency: NETWORK_TOKENS.Avalanche,
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
  'Binance-Smart-Chain': 10512000,
  'Ethereum': 2102400,
  'Avalanche': 15768000,
};
