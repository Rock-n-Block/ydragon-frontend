import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';

import arrow from '../../assets/img/icons/icon-arrow-yellow.svg';
import bncDark from '../../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../../assets/img/icons/icon-binance-light.svg';
import plgDark from '../../assets/img/icons/icon-polygon-dark.svg';
import plgLight from '../../assets/img/icons/icon-polygon-light.svg';
import { basicTokensApi, networksApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { rootStore, useMst } from '../../store/store';
import TokenMini from '../TokenMini';

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

type ChainTypes = 'bnb' | 'matic';

type IChains = {
  [key in ChainTypes]: AddEthereumChainParameter;
};

const devChains: IChains = {
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
  },
  matic: {
    chainId: '0x13881',
    chainName: 'Matic Testnet Mumbai',
    nativeCurrency: {
      name: 'tMATIC',
      symbol: 'tMATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
};
const prodChains: IChains = {
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
  },
  matic: {
    chainId: '0x89',
    chainName: 'Matic(Polygon) Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mainnet.matic.network'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
};

const SelectNetwork: React.FC = observer(() => {
  const isProduction = process.env.REACT_APP_IS_PROD === 'production';
  const chains = isProduction ? prodChains : devChains;

  const { networks, basicTokens, theme } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [pickedChain, setPickedChain] = useState<ChainTypes>();
  const networkToken = {
    bnb: {
      symbol: 'bnb',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      name: 'Binance Coin',
      image: theme.value === 'dark' ? bncDark : bncLight,
    },
    polygon: {
      symbol: 'matic',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      name: 'Polygon (Matic)',
      image: theme.value === 'dark' ? plgDark : plgLight,
    },
  };
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
          if (currentChainId === chains.bnb.chainId) {
            rootStore.networks.setCurrNetwork('binance-smart-chain');
          } else if (currentChainId === chains.matic.chainId) {
            rootStore.networks.setCurrNetwork('polygon-pos');
          }
        }
      });
    });
  }, [chains, walletConnector.metamaskService]);

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

  const getBasicTokens = useCallback(() => {
    basicTokensApi.getBaseTokens().then(({ data }) => {
      basicTokens.setTokens([
        rootStore.networks.currentNetwork === 'binance-smart-chain'
          ? networkToken.bnb
          : networkToken.polygon,
        ...data,
      ]);
    });
  }, [networkToken.bnb, networkToken.polygon, basicTokens]);

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
  }, [chains, networks.networkId]);

  useEffect(() => {
    if (networks.currentNetwork) {
      getBasicTokens();
    }
  }, [getBasicTokens, networks.currentNetwork]);

  return (
    <Select
      value={pickedChain}
      placeholder="Select network"
      onSelect={switchChain}
      style={{ width: 140 }}
      className="select-network"
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ position: 'fixed' }}
      // getPopupContainer={(trigger) => trigger.parentNode}
      suffixIcon={
        <img className="select__arrow" alt="select arrow" src={arrow} width="10" height="6" />
      }
      dropdownClassName="select-network__dropdown"
    >
      <Option value="bnb">
        <TokenMini
          name="Binance"
          icon={theme.value === 'dark' ? bncDark : bncLight}
          width="26"
          height="26"
        />
      </Option>
      <Option value="matic">
        <TokenMini
          name="Polygon"
          icon={theme.value === 'dark' ? plgDark : plgLight}
          width="26"
          height="26"
        />
      </Option>
    </Select>
  );
});
export default SelectNetwork;
