import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';

import arrow from '../../assets/img/icons/icon-arrow-yellow.svg';
import config, { TChain } from '../../config';
import { networksApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import MetamaskService from '../../services/web3';
import { useMst } from '../../store/store';
import TokenMini from '../TokenMini';
import cn from 'classnames';

const { Option } = Select;

const SelectNetwork: React.FC = observer(() => {
  const { IS_PRODUCTION, FULL_CHAIN_INFO, NETWORK_BY_CHAIN_ID } = config;
  const isProduction = IS_PRODUCTION ? 'mainnet' : 'testnet';
  const chains = FULL_CHAIN_INFO[isProduction];

  const { networks, theme } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [pickedChain, setPickedChain] = useState<TChain>();
  const getNetworks = useCallback(() => {
    networksApi
      .getNetworks()
      .then(({ data }) => {
        networks.setNetworks(data);
      })
      .catch((err) => {
        const { response } = err;
        console.error(response);
      });
  }, [networks]);

  const getCurrentChain = useCallback(() => {
    walletConnector.metamaskService.ethGetCurrentChain().then((currentChainId: string) => {
      Object.keys(chains).forEach((key) => {
        if (chains[key as TChain].chainId === currentChainId) {
          setPickedChain(key as TChain);
          networks.setCurrNetwork((NETWORK_BY_CHAIN_ID[isProduction] as any)[currentChainId]);
        }
      });
    });
  }, [walletConnector.metamaskService, chains, networks, NETWORK_BY_CHAIN_ID, isProduction]);

  const switchChain = async (chainName: TChain) => {
    try {
      await MetamaskService.switchEthereumChain(FULL_CHAIN_INFO[isProduction][chainName].chainId);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await MetamaskService.addEthereumChain(FULL_CHAIN_INFO[isProduction][chainName]);
        } catch (addError) {
          console.error('add chain error', addError);
          // handle "add" error
        }
      }
      // handle other "switch" errors
      console.error('Other switch error', switchError);
    }
  };

  useEffect(() => {
    getNetworks();
  }, [getNetworks]);

  useEffect(() => {
    if (walletConnector.metamaskService.isWindowEthEnabled() && networks.networksList.length) {
      getCurrentChain();
    }
  }, [getCurrentChain, networks.networksList.length, walletConnector.metamaskService]);

  useEffect(() => {
    Object.keys(chains).forEach((key) => {
      if (chains[key as TChain].chainId === networks.networkId) {
        setPickedChain(key as TChain);
      }
    });
  }, [chains, networks.networkId]);

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
      dropdownClassName={cn(theme.value, 'select-network__dropdown')}
    >
      {Object.keys(FULL_CHAIN_INFO[isProduction]).map((network) => (
        <Option value={network as TChain} key={`option_${network}`}>
          <TokenMini
            name={FULL_CHAIN_INFO[isProduction][network as TChain].shortName}
            icon={FULL_CHAIN_INFO[isProduction][network as TChain].nativeCurrency.image(
              theme.value,
            )}
            width="26"
            height="26"
          />
        </Option>
      ))}
    </Select>
  );
});
export default SelectNetwork;
