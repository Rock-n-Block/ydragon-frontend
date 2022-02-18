import { INetwork, IProvider, ISettings } from '@amfi/connect-wallet/dist/interface';

export type TChain = 'Ethereum' | 'Binance-Smart-Chain' | 'Avalanche' /*   | 'Polygon' */;

export enum chainsEnum {
  Ethereum = 'Ethereum',
  'Binance-Smart-Chain' = 'Binance-Smart-Chain',
  Polygon = 'Polygon',
  Avalanche = 'Avalanche',
}

export interface IConnectWallet {
  wallets: string[];
  network: INetwork;
  provider: {
    [index: string]: IProvider;
  };
  settings: ISettings;
}

export interface IChainConfig {
  name: string;
  id: number;
  rpc: string;
  tx: {
    link: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExp: string;
}

export interface IContracts {
  decimals: number;
  names: string[];
  type: string;
  params: {
    [index: string]: {
      address: string;
      abi: any[];
    };
  };
}

interface INativeCurrency {
  name: string;
  symbol: string; // 2-6 characters long
  decimals: number;
}

export interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}
