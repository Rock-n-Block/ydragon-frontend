import React from 'react';

import bnb from '../../../assets/img/tokens/bnb.svg';
import btc from '../../../assets/img/tokens/btc.svg';
import dero from '../../../assets/img/tokens/dero.svg';
import eth from '../../../assets/img/tokens/eth.svg';
import { Button, GradientText, TokenItem } from '../../index';

import './Composition.scss';

const Composition: React.FC = () => {
  const tokens = [
    {
      icon: btc,
      name: 'Bitcoin',
      abbr: 'BTC',
      weight: '25%',
    },
    {
      icon: bnb,
      name: 'Binance',
      abbr: 'BNB',
      weight: '25%',
    },
    {
      icon: eth,
      name: 'Ethereum',
      abbr: 'ETH',
      weight: '25%',
    },
    {
      icon: dero,
      name: 'DERO',
      abbr: 'DERO',
      weight: '25%',
    },
  ];

  return (
    <section className="section section--admin">
      <div className="section__title">
        <GradientText width="190" height="36" text="head" />
      </div>

      <div className="composition">
        <div className="composition__title">Index composition</div>

        <div className="composition__content">
          {tokens.map((token) => (
            <TokenItem
              icon={token.icon}
              name={token.name}
              abbr={token.abbr}
              weight={token.weight}
            />
          ))}
        </div>

        <div className="composition__btns-row">
          <Button text="add / remove token" />
          <Button text="Change Weight" />
        </div>
      </div>
    </section>
  );
};

export default Composition;
