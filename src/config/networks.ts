// type ChainTypes = 'bnb' | 'matic' | 'eth';
export type ChainTypes = 'bnb' | 'eth';

export interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
  // https://github.com/ChainSafe/web3.js/issues/4258
  // https://github.com/ChainSafe/web3.js/pull/4241/files#diff-9050e060908a6957eb4e25bb2f4b8930f5097e55e846e0e8194ff5fa3a3440a4R862
  supportsEIP1559?: boolean;
}

export type IChains = {
  [key in ChainTypes]: AddEthereumChainParameter;
};

export const devChains: IChains = {
  bnb: {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    supportsEIP1559: false,
  },
  /*  matic: {
    chainId: '0x13881',
    chainName: 'Matic Testnet Mumbai',
    nativeCurrency: {
      name: 'tMATIC',
      symbol: 'tMATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  }, */
  eth: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'tETH',
      symbol: 'tETH',
      decimals: 18,
    },
    rpcUrls: ['https://ropsten.infura.io/v3/e15330fb7e954a868e15297dd74dea37'],
    blockExplorerUrls: ['https://ropsten.etherscan.io/'],
    supportsEIP1559: true,
  },
};

export const prodChains: IChains = {
  bnb: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    supportsEIP1559: false,
  },
  /*  matic: {
      chainId: '0x89',
      chainName: 'Matic(Polygon) Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mainnet.matic.network'],
      blockExplorerUrls: ['https://polygonscan.com'],
    }, */
  eth: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/e15330fb7e954a868e15297dd74dea37'],
    blockExplorerUrls: ['https://etherscan.io/'],
    supportsEIP1559: true,
  },
};
