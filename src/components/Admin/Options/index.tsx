import React, { useEffect, useState } from 'react';
import { Button, Switch } from '../../index';
import './Options.scss';
import { InputNumber } from '../../Input';
import { useWalletConnectorContext } from '../../../services/walletConnect';

interface OptionsProps {
  address: string;
}

const Options: React.FC<OptionsProps> = ({ address }) => {
  const [isAutoRebalanceEnabled, setIsAutoRebalanceEnabled] = useState<boolean | undefined>(
    undefined,
  );
  const walletConnector = useWalletConnectorContext();

  const handleAutoRebalanceChange = (isChecked: boolean) => {
    walletConnector.metamaskService
      .changeAutoXYRebalaceAllowance(address, isChecked)
      .catch((error: any) => {
        const { request } = error;
        console.log(request);
      });
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
          <InputNumber defaultValue={20} min={0} max={20} formatter={(value) => `${value}%`} />
          <Button className="options__option-btn">Launch</Button>
          <p className="options__option-name">Manual rebalance </p>
        </div>
      </div>
    </section>
  );
};
export default Options;
