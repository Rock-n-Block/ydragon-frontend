import React, { useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';

import arrow from '../../assets/img/icons/icon-arrow-yellow.svg';
import config from '../../config';
import { networksApi } from '../../services/api';
import { useMst } from '../../store/store';
import TokenMini from '../TokenMini';
import cn from 'classnames';
import { chainsEnum } from '../../types';
import { useWalletConnectorContext } from '../../services/walletConnect';

const { Option } = Select;

const SelectNetwork: React.FC = observer(() => {
  const { IS_PRODUCTION, FULL_CHAIN_INFO } = config;
  const isProduction = IS_PRODUCTION ? 'mainnet' : 'testnet';
  // const chains = FULL_CHAIN_INFO[isProduction];

  const { networks, theme } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [pickedChain, setPickedChain] = useState<chainsEnum>();
  const getNetworks = useCallback(() => {
    networksApi
      .getNetworks()
      .then(({ data }) => {
        /*
        const localStorageChainName = localStorage.getItem('ydr_chainName');
        if (localStorageChainName) {
          setPickedChain(localStorageChainName as chainsEnum);
        } else {
          setPickedChain(data[0].name as chainsEnum);
          localStorage.setItem('ydr_chainName', data[0].name);
        }
 */
        networks.setNetworks(data);
      })
      .catch((err) => {
        const { response } = err;
        console.error(response);
      });
  }, [networks]);
  const switchChain = useCallback(
    (chainName: chainsEnum) => {
      walletConnector.disconnect();
      networks.setCurrNetwork(chainName);
      setPickedChain(chainName);
      localStorage.setItem('ydr_chainName', chainName);
    },
    [networks, walletConnector],
  );
  const getCurrentChain = useCallback(() => {
    setPickedChain(localStorage.getItem('ydr_chainName') as chainsEnum);
  }, []);

  /* const switchChain = async (chainName: chainsEnum) => {
    try {
      await WalletService.switchEthereumChain(FULL_CHAIN_INFO[isProduction][chainName].chainId);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await WalletService.addEthereumChain(FULL_CHAIN_INFO[isProduction][chainName]);
        } catch (addError) {
          console.error('add chain error', addError);
          // handle "add" error
        }
      }
      // handle other "switch" errors
      console.error('Other switch error', switchError);
    }
  }; */

  useEffect(() => {
    getNetworks();
  }, [getNetworks]);

  useEffect(() => {
    getCurrentChain();
  }, [getCurrentChain]);

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
        <Option value={network as chainsEnum} key={`option_${network}`}>
          <TokenMini
            name={FULL_CHAIN_INFO[isProduction][network as chainsEnum].shortName}
            icon={FULL_CHAIN_INFO[isProduction][network as chainsEnum].nativeCurrency.image(
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
