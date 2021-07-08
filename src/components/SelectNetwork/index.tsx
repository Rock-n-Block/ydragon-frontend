import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store/store';
import { useWalletConnectorContext } from '../../services/walletConnect';

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

type ChainTypes = 'bnbt' | 'tmatic';

type IChains = {
  [key in ChainTypes]: AddEthereumChainParameter;
};

const chains: IChains = {
  bnbt: {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  tmatic: {
    chainId: '0x13881',
    chainName: 'Matic Testnet Mumbai',
    nativeCurrency: {
      name: 'tMATIC',
      symbol: 'tMATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://matic.network/'],
  },
};

const SelectNetwork: React.FC = observer(() => {
  const { networks } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [pickedChain, setPickedChain] = useState<ChainTypes>();

  const getCurrentChain = useCallback(() => {
    const currentChain = walletConnector.metamaskService.ethGetCurrentChain();

    Object.keys(chains).forEach((key) => {
      if (chains[key as ChainTypes].chainId === currentChain) {
        setPickedChain(key as ChainTypes);
      }
    });
  }, [walletConnector.metamaskService]);

  useEffect(() => {
    getCurrentChain();
  }, [getCurrentChain]);

  const switchChain = async (chainName: ChainTypes) => {
    try {
      await window.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chains[chainName].chainId }],
        })
        .then(() => {
          networks.setNetwork(chainName);
          setPickedChain(chainName);
        });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum
            .request({
              method: 'wallet_addEthereumChain',
              params: [chains[chainName]],
            })
            .then(() => {
              setPickedChain(chainName);
            });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };

  return (
    <Select
      value={pickedChain}
      placeholder="Select network"
      onSelect={switchChain}
      style={{ width: 120 }}
    >
      <Option value="bnbt">BSC</Option>
      <Option value="tmatic">Polygon</Option>
    </Select>
  );
});
export default SelectNetwork;
