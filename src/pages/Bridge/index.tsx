import React, { useState } from 'react';

import bscLogo from '../../assets/img/icons/blockchains/bsc.svg';
import ethLogo from '../../assets/img/icons/blockchains/eth.svg';
import link from '../../assets/img/icons/icon-link.svg';
import indexLogo from '../../assets/img/icons/logo-index.svg';
import Dropdown from '../../components/Bridge/Dropdown';

import './Bridge.scss';

const indexes = [
  {
    img: indexLogo,
    title: 'Index token 1',
  },
  {
    img: indexLogo,
    title: 'Index token 2',
  },
  {
    img: indexLogo,
    title: 'Index token 3',
  },
  {
    img: indexLogo,
    title: 'Index token 4',
  },
];

const blockchains = [
  {
    img: ethLogo,
    title: 'Ethereum',
  },
  {
    img: bscLogo,
    title: 'Binance Smart Chain',
  },
];

const Bridge: React.FC = () => {
  const [fromBlockchainIndex, setFromBlockchainIndex] = useState(0);
  const [toBlockchainIndex, setToBlockchainIndex] = useState(1);
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);

  const setBlockchainIndex = (type: 'from' | 'to', index: number): void => {
    if (
      (type === 'from' && index === fromBlockchainIndex) ||
      (type === 'to' && index === toBlockchainIndex)
    ) {
      return;
    }

    const oppositeIndex = index === 0 ? 1 : 0;
    if (type === 'from') {
      setFromBlockchainIndex(index);
      setToBlockchainIndex(oppositeIndex);
    } else {
      setToBlockchainIndex(index);
      setFromBlockchainIndex(oppositeIndex);
    }
  };

  return (
    <div className="bridge">
      <form className="form">
        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">Choose Token</div>
          </div>
          <Dropdown
            items={indexes}
            activeIndex={activeTokenIndex}
            setActiveIndex={setActiveTokenIndex}
          />
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">From</div>
          </div>
          <Dropdown
            items={blockchains}
            activeIndex={fromBlockchainIndex}
            setActiveIndex={(index) => setBlockchainIndex('from', index)}
          />
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">To</div>
          </div>
          <Dropdown
            items={blockchains}
            activeIndex={toBlockchainIndex}
            setActiveIndex={(index) => setBlockchainIndex('to', index)}
          />
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">Amount</div>
            <div className="form__item__header__link">
              <div className="form__item__header__link__text">ETHERSCAN KYP</div>
              <img src={link} alt="etherscan link" />
            </div>
          </div>
          <div className="gradient-box">
            <div className="box form__item__input">
              <input type="text" placeholder="Enter amount" />
              <div className="form__item__input__send-max">
                <div className="form__item__input__send-max__text">SEND MAX</div>
              </div>
            </div>
          </div>
          <div className="form__item__footer">
            <div className="form__item__footer__fee">
              <div className="form__item__footer__fee__text">Fee: 1</div>
            </div>
            <div className="form__item__footer__min-amount">Minimum amount: 0.00546 KYP</div>
          </div>
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">You will receive</div>
            <div className="form__item__header__link">
              <div className="form__item__header__link__text">ETHERSCAN KYP</div>
              <img src={link} alt="etherscan link" />
            </div>
          </div>
          <div className="gradient-box">
            <div className="box">
              <div className="box__value">544.4115</div>
            </div>
          </div>
        </div>

        <div className="form__note">Note: Transfer from Ethereum Network with Metamask wallet</div>

        <div className="form__submit">
          <div className="form__submit__button">
            <div className="form__submit__button__text">SWAP</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Bridge;
