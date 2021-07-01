import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { Button, Switch } from '../../index';
import { InputNumber } from '../../Input';

import './Options.scss';

interface OptionsProps {
  address: string;
  onManualInputChange: (value: string) => void;
}

const Options: React.FC<OptionsProps> = observer(({ address, onManualInputChange }) => {
  const { modals } = useMst();
  const [isAutoRebalanceEnabled, setIsAutoRebalanceEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const walletConnector = useWalletConnectorContext();

  const handleAutoRebalanceChange = (isChecked: boolean) => {
    walletConnector.metamaskService
      .changeAutoXYRebalaceAllowance(address, isChecked)
      .catch((error: any) => {
        const { request } = error;
        console.log(request);
      });
  };
  const handleManualRebalanceStart = () => {
    if (inputValue) {
      walletConnector.metamaskService
        .startXyRebalance(address, +new BigNumber(inputValue).multipliedBy(100).toString(10))
        .then(() => {
          modals.info.setMsg('Operation success', 'Rebalance started', 'success');
        })
        .catch((error: any) => {
          const { request } = error;
          console.log(request);
        });
    }
  };
  const handleInputChange = (value: any) => {
    setInputValue(value);
    if (value) {
      const countDecimals = () => {
        if (Math.floor(value) !== value) return value.toString().split('.')[1].length || 0;
        return 0;
      };
      if (countDecimals() > 2) {
        setIsError(true);
      } else {
        setIsError(false);
      }
    }
    onManualInputChange(value);
  };
  useEffect(() => {
    if (address) {
      walletConnector.metamaskService
        .checkAutoXYRebalaceAllowance(address)
        .then((data: boolean) => {
          setIsAutoRebalanceEnabled(data);
        })
        .catch((error: any) => {
          const { request } = error;
          console.log(request);
        });
    }
  }, [address, walletConnector]);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Index options</h2>
      <div className="options">
        <div className="options__option">
          {isAutoRebalanceEnabled !== undefined && (
            <Switch defaultChecked={isAutoRebalanceEnabled} onChange={handleAutoRebalanceChange} />
          )}
          <p className="options__option-name">Automatic rebalancing</p>
        </div>
        <div className="options__option">
          <div className="options__option__input-wrapper">
            <InputNumber
              value={inputValue}
              min={0}
              max={20}
              placeholder="20%"
              formatter={(value) => `${value}%`}
              onChange={handleInputChange}
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
