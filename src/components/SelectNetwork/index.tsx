import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';

import arrow from '../../assets/img/icons/icon-arrow-yellow.svg';
import bncDark from '../../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../../assets/img/icons/icon-binance-light.svg';
import plgDark from '../../assets/img/icons/icon-polygon-dark.svg';
import plgLight from '../../assets/img/icons/icon-polygon-light.svg';
import { networksApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';
import TokenMini from '../TokenMini';

import './SelectNetwork.scss';

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
  const { networks, theme } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [pickedChain, setPickedChain] = useState<ChainTypes>();

  const getNetworks = useCallback(() => {
    networksApi
      .getNetworks()
      .then(({ data }) => {
        networks.setNetworks(data);
      })
      .catch((err) => {
        const { response } = err;
        console.log(response);
      });
  }, [networks]);
  const getCurrentChain = useCallback(() => {
    walletConnector.metamaskService.ethGetCurrentChain().then((currentChainId: string) => {
      Object.keys(chains).forEach((key) => {
        if (chains[key as ChainTypes].chainId === currentChainId) {
          setPickedChain(key as ChainTypes);
        }
      });
    });
  }, [walletConnector.metamaskService]);

  const switchChain = async (chainName: ChainTypes) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chains[chainName].chainId }],
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

  useEffect(() => {
    getNetworks();
  }, [getNetworks]);

  useEffect(() => {
    getCurrentChain();
  }, [getCurrentChain]);

  useEffect(() => {
    Object.keys(chains).forEach((key) => {
      if (chains[key as ChainTypes].chainId === networks.id) {
        setPickedChain(key as ChainTypes);
      }
    });
  }, [networks.id]);

  return (
    <Select
      value={pickedChain}
      placeholder="Select network"
      onSelect={switchChain}
      style={{ width: 120 }}
      className="select-network"
      suffixIcon={<img className="select__arrow" alt="select arrow" src={arrow} width="10" height="6" />}
      dropdownClassName="select-network__dropdown"
    >
      <Option value="bnbt">
        <TokenMini
          name=""
          icon={theme.value === 'dark' ? bncDark : bncLight}
          width="26"
          height="26"
        />
        BSC
      </Option>
      <Option value="tmatic">
        <TokenMini
          name=""
          icon={theme.value === 'dark' ? plgDark : plgLight}
          width="26"
          height="26"
        />
        Polygon
      </Option>
    </Select>
  );
});
export default SelectNetwork;
