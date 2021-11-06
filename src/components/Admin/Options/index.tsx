import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { ProviderRpcError } from '../../../types/errors';
import { Button, Switch } from '../../index';
import Input from '../../Input';

import './Options.scss';
import txToast from '../../ToastWithTxHash';
import { toast } from 'react-toastify';

interface OptionsProps {
  address: string;
}

const Options: React.FC<OptionsProps> = observer(({ address }) => {
  const [isAutoRebalanceChecked, setIsAutoRebalanceChecked] = useState<boolean | undefined>(
    undefined,
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const walletConnector = useWalletConnectorContext();

  const handleAutoRebalanceChange = (isChecked: boolean) => {
    setIsAutoRebalanceChecked(isChecked);
    walletConnector.metamaskService
      .changeAutoXYRebalaceAllowance(address, isChecked)
      .on('transactionHash', (hash: string) => {
        txToast(hash);
      })
      .then(() => {
        toast.success(`Automatic rebalancing is ${isChecked ? 'enabled' : 'disabled'}`);
      })
      .catch((error: ProviderRpcError) => {
        const { message } = error;
        toast.error('Something went wrong');
        console.error(`AutoRebalance error`, message);
        setIsAutoRebalanceChecked(!isChecked);
      });
  };
  const handleManualRebalanceStart = () => {
    if (inputValue) {
      walletConnector.metamaskService
        .startXyRebalance(address, +new BigNumber(inputValue).multipliedBy(100).toString(10))
        .on('transactionHash', (hash: string) => {
          txToast(hash);
        })
        .then(() => {
          toast.success(`Now xVault percentage is ${inputValue}%`);
        })
        .catch((error: ProviderRpcError) => {
          const { message } = error;
          toast.error('Something went wrong');
          console.error(`Rebalance error`, message);
        });
    }
  };
  const handleInputChange = (value: any) => {
    setInputValue(value);
    if (value) {
      const countDecimals = () => {
        if (Math.floor(+value) !== +value) return value.split('.')[1].length || 0;
        return 0;
      };
      if (countDecimals() > 2) {
        setIsError(true);
      } else {
        setIsError(false);
      }
    }
  };
  const handleBlur = () => {
    if (+inputValue <= 5) {
      if (inputValue) {
        setInputValue('5');
      } else {
        setInputValue('');
      }
    }
    if (+inputValue >= 20) {
      setInputValue('20');
    }
  };
  useEffect(() => {
    if (address) {
      walletConnector.metamaskService
        .checkAutoXYRebalaceAllowance(address)
        .then((data: boolean) => {
          setIsAutoRebalanceChecked(data);
        })
        .catch((error: any) => {
          const { request } = error;
          console.error(request);
        });
    }
  }, [address, walletConnector]);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Index options</h2>
      <div className="options">
        <div className="options__option">
          {isAutoRebalanceChecked !== undefined && (
            <Switch checked={isAutoRebalanceChecked} onChange={handleAutoRebalanceChange} />
          )}
          <p className="options__option-name">Automatic rebalancing</p>
        </div>
        <div className="options__option options__option-with-input">
          <div className="options__option__input-wrapper">
            <Input
              type="number"
              value={inputValue}
              placeholder="20"
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleBlur}
              suffix="%"
              className="ant-input-number input"
            />
            {isError && <p className="options__option-error">Minimal decimals equals to 0.01</p>}
          </div>
          <Button
            className="options__option-btn"
            disabled={isError}
            onClick={handleManualRebalanceStart}
          >
            Launch
          </Button>
          <p className="options__option-name">Manual rebalance </p>
        </div>
      </div>
    </section>
  );
});
export default Options;
