// type ChainTypes = 'bnb' | 'matic' | 'eth';
export type ChainTypes = 'bnb' | 'eth' | 'avax';

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
  eth: {
    chainId: '0x2a',
    chainName: 'Kovan',
    nativeCurrency: {
      name: 'tETH',
      symbol: 'tETH',
      decimals: 18,
    },
    rpcUrls: ['https://kovan.infura.io/v3/68921e4290344321ad607569b85f0c9e'],
    blockExplorerUrls: ['https://kovan.etherscan.io/'],
    supportsEIP1559: true,
  },
  avax: {
    chainId: '0xa869',
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.avascan.info/'],
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
  avax: {
    chainId: '0xa86a',
    chainName: 'Avalanche Mainnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
    supportsEIP1559: true,
  },
};
