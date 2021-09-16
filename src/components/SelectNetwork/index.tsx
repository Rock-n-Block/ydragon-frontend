import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';

import eth from '../../assets/img/icons/blockchains/eth.svg';
import arrow from '../../assets/img/icons/icon-arrow-yellow.svg';
import bncDark from '../../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../../assets/img/icons/icon-binance-light.svg';
// import plgDark from '../../assets/img/icons/icon-polygon-dark.svg';
// import plgLight from '../../assets/img/icons/icon-polygon-light.svg';
// import { /* basicTokensApi, */ networksApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';
import TokenMini from '../TokenMini';
import { ChainTypes, prodChains, devChains } from '../../config/networks';

const { Option } = Select;

const SelectNetwork: React.FC = observer(() => {
  const isProduction = process.env.REACT_APP_IS_PROD === 'production';
  const chains = isProduction ? prodChains : devChains;

  const { networks, /* basicTokens, */ theme, user } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [pickedChain, setPickedChain] = useState<ChainTypes>();
  /* const networkToken = {
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
  }; */
  /* const getNetworks = useCallback(() => {
    networksApi
      .getNetworks()
      .then(({ data }) => {
        networks.setNetworks(data);
      })
      .catch((err) => {
        const { response } = err;
        console.log(response);
      });
  }, [networks]); */

  const getCurrentChain = useCallback(() => {
    walletConnector.walletService.requestCurrentChain().then((currentChainId: string) => {
      Object.keys(chains).forEach((key) => {
        if (chains[key as ChainTypes].chainId === currentChainId) {
          setPickedChain(key as ChainTypes);
          // TODO: change this on deploy
          if (currentChainId === chains.bnb.chainId) {
            networks.setCurrNetwork('binance-smart-chain');
            // } else if (currentChainId === chains.matic.chainId) {
            //   networks.setCurrNetwork('polygon-pos');
          } else if (currentChainId === chains.eth.chainId) {
            networks.setCurrNetwork('ethereum');
          }
        }
      });
    });
  }, [networks, chains, walletConnector.walletService]);

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
    if (networks.networksList.length && user.address) {
      getCurrentChain();
    }
  }, [getCurrentChain, networks.networksList.length, user.address]);

  useEffect(() => {
    Object.keys(chains).forEach((key) => {
      if (chains[key as ChainTypes].chainId === networks.networkId) {
        setPickedChain(key as ChainTypes);
      }
    });
  }, [chains, networks.networkId]);

  /* useEffect(() => {
     if (networks.currentNetwork) {
       getBasicTokens();
     }
   }, [getBasicTokens, networks.currentNetwork]); */

  return (
    <Select
      value={pickedChain}
      placeholder="Select network"
      onSelect={switchChain}
      style={{ width: 156 }}
      className="select-network"
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ position: 'fixed' }}
      // getPopupContainer={(trigger) => trigger.parentNode}
      suffixIcon={
        <img className="select__arrow" alt="select arrow" src={arrow} width="10" height="6" />
      }
      dropdownClassName="select-network__dropdown"
    >
      <Option value="eth">
        <TokenMini name="Ethereum" icon={eth} width="26" height="26" />
      </Option>
      <Option value="bnb">
        <TokenMini
          name="Binance"
          icon={theme.value === 'dark' ? bncDark : bncLight}
          width="26"
          height="26"
        />
      </Option>
      {/* <Option value="matic">
        <TokenMini
          name="Polygon"
          icon={theme.value === 'dark' ? plgDark : plgLight}
          width="26"
          height="26"
        />
      </Option> */}
    </Select>
  );
});
export default SelectNetwork;
