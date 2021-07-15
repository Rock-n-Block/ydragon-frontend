import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../services/walletConnect';
import { rootStore, useMst } from '../../store/store';
import arrow from '../../assets/img/icons/icon-arrow-yellow.svg';
import bncLight from '../../assets/img/icons/icon-binance-light.svg';
import bncDark from '../../assets/img/icons/icon-binance-dark.svg';
import plgLight from '../../assets/img/icons/icon-polygon-light.svg';
import plgDark from '../../assets/img/icons/icon-polygon-dark.svg';

import './SelectNetwork.scss';
import TokenMini from '../TokenMini';
import { networksApi, ratesApi } from '../../services/api';

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
  const { networks, networkTokens, theme } = useMst();
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
          // TODO: change this on deploy
          if (currentChainId === '0x61') {
            rootStore.networks.setCurrNetwork('binance-smart-chain');
          } else if (currentChainId === '0x13881') {
            rootStore.networks.setCurrNetwork('polygon');
          }
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
  const getNetworkTokens = useCallback(() => {
    ratesApi
      .getNetworkTokens()
      .then(({ data }) => {
        networkTokens.setTokens(data);
      })
      .catch();
  }, [networkTokens]);

  useEffect(() => {
    getNetworks();
  }, [getNetworks]);

  useEffect(() => {
    if (networks.networksList.length) {
      getCurrentChain();
    }
  }, [getCurrentChain, networks.networksList.length]);

  useEffect(() => {
    Object.keys(chains).forEach((key) => {
      if (chains[key as ChainTypes].chainId === networks.networkId) {
        setPickedChain(key as ChainTypes);
      }
    });
  }, [networks.networkId]);

  useEffect(() => {
    if (networks.currentNetwork) {
      getNetworkTokens();
    }
  }, [getNetworkTokens, networks.currentNetwork]);

  return (
    <Select
      value={pickedChain}
      placeholder="Select network"
      onSelect={switchChain}
      style={{ width: 120 }}
      className="select-network"
      suffixIcon={<img className="select__arrow" alt="" src={arrow} />}
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
