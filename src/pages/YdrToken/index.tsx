import React, { useState, FC } from 'react';

import nextId from 'react-id-generator';
import { observer } from 'mobx-react-lite';

import logos from '../../assets/img/icons/logo.svg';
import { Button, YDRTokenChart } from '../../components';
import { data } from './data';

import './YDRToken.scss';

interface IExchangeItemProps {
  title: string;
  buyLink: string;
  sellLink: string;
  logo: string;
}

const ExchangeItem: FC<IExchangeItemProps> = ({ buyLink, sellLink, logo, title }) => (
  <div className="token-panel__btns-group">
    <div className="token-panel__info">
      <div className="token-panel__logo">
        <img src={logo} alt="exchange logo" />
      </div>
      <div className="token-panel__subtitle">{title}</div>
    </div>
    <div className="token-panel__btns">
      <Button target="_blank" rel="noopener noreferrer" link={buyLink} className="token-panel__btn">
        Buy
      </Button>
      <Button
        link={sellLink}
        target="_blank"
        rel="noopener noreferrer"
        className="token-panel__btn"
        styledType="outline"
      >
        Sell
      </Button>
    </div>
  </div>
);

const YdrToken: React.FC = observer(() => {
  const [price, setPrice] = useState(1);

  const updatePrice = (value: number) => {
    setPrice(value);
  };

  return (
    <main className="container page">
      <div className="page__title-row">
        <div className="page__title-icon page__title-icon--ydr">
          <img src={logos} alt="logo" width="31" height="28" />
        </div>

        <div className="page__title-wrapper">
          <h1 className="page__title text-outline">YDR token</h1>
        </div>
      </div>

      <div className="token-panel token-panel-ydr">
        <div className="token-panel__content">
          <div className="token-panel-item" key={nextId()}>
            <div className="token-panel-item__value">{`$${price.toFixed(6)}`}</div>
            <div className="token-panel-item__label">Price</div>
          </div>
        </div>

        <div className="token-panel__btns token-panel-ydr__btns">
          {data.map((item) => (
            <ExchangeItem key={item.buyLink} {...item} />
          ))}
        </div>
      </div>
      <YDRTokenChart price={updatePrice} className="ydragon-chart" />
    </main>
  );
});

export default YdrToken;
