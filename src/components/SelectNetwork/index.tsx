import React from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store/store';

const { Option } = Select;

interface AddEthereumChainParameter {
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
}

const SelectNetwork: React.FC = observer(() => {
  const { networks } = useMst();

  const bnbt: AddEthereumChainParameter = {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  };

  const tmatic: AddEthereumChainParameter = {
    chainId: '0x13881',
    chainName: 'Matic Testnet Mumbai',
    nativeCurrency: {
      name: 'tMATIC',
      symbol: 'tMATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://matic.network/'],
  };

  const chains = {
    bnbt,
    tmatic,
  };

  const switchChain = async (chainName: 'bnbt' | 'tmatic') => {
    try {
      await window.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chains[chainName].chainId }],
        })
        .then(() => {
          networks.setNetwork(chainName);
        });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chains[chainName]],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };

  return (
    <Select placeholder="Select network" onSelect={switchChain} style={{ width: 120 }}>
      <Option value="bnbt">BSC</Option>
      <Option value="tmatic">Polygon</Option>
    </Select>
  );
});
export default SelectNetwork;
