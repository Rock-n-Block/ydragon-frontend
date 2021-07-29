import React, { useState } from 'react';

import arrowDown from '../../assets/img/icons/icon-arrow-down-orange.svg';
import indexLogo from '../../assets/img/icons/logo-index.svg';
import link from '../../assets/img/icons/icon-link.svg';

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

const Bridge: React.FC = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bridge">
      <form className="form" action="submit">
        <div className="form__header">
          <div className="form__header__title">From</div>
        </div>
        <div className="box form__network">
          <div className="box__items__item">
            <div className="box__items__item__title">Ethereum</div>
          </div>
        </div>
        <div className="form__header">
          <div className="form__header__title">To</div>
        </div>
        <div className={`gradient-box ${isSelectOpen ? 'open' : null}`}>
          <div className={`box form__select ${isSelectOpen ? 'open' : null}`}>
            <div className="box__items">
              <div className="box__items__item">
                <div className="box__items__item__logo">
                  <img src={indexes[activeIndex].img} alt="index logo" />
                </div>
                <div className="box__items__item__title">{indexes[activeIndex].title}</div>
              </div>
              {isSelectOpen
                ? indexes.map((index, id) => {
                    if (id !== activeIndex)
                      return (
                        <div
                          className="box__items__item"
                          role="button"
                          tabIndex={0}
                          onKeyPress={() => console.log('change active index')}
                          key={index.title}
                          onClick={() => {
                            setActiveIndex(id);
                            setIsSelectOpen(false);
                          }}
                        >
                          <div className="box__items__item__logo">
                            <img src={index.img} alt="index logo" />
                          </div>
                          <div className="box__items__item__title grey">{index.title}</div>
                        </div>
                      );
                    return null;
                  })
                : null}
            </div>
            <div
              role="button"
              tabIndex={0}
              className={`form__select__switch ${isSelectOpen ? 'open' : 'close'}`}
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              onKeyPress={() => console.log('keypress')}
            >
              <img src={arrowDown} alt="arrow down orange" />
            </div>
          </div>
        </div>
        <div className="form__header">
          <div className="form__header__title">Amount</div>
          <div className="form__header__link">
            <div className="form__header__link__text">ETHERSCAN KYP</div>
            <img src={link} alt="etherscan link" />
          </div>
        </div>
        <div className="gradient-box">
          <div className="box form__input">
            <input type="text" placeholder="Enter amount" />
            <div className="form__input__send-max">
              <div className="form__input__send-max__text">SEND MAX</div>
            </div>
          </div>
        </div>
        <div className="form__footer">
          <div className="form__footer__fee">
            <div className="form__footer__fee__text">Fee: 1</div>
          </div>
          <div className="form__footer__min-amount">Minimum amount: 0.00546 KYP</div>
        </div>
        <div className="form__header">
          <div className="form__header__title">You will receive</div>
          <div className="form__header__link">
            <div className="form__header__link__text">ETHERSCAN KYP</div>
            <img src={link} alt="etherscan link" />
          </div>
        </div>
        <div className="gradient-box">
          <div className="box">
            <div className="box__value">544.4115</div>
          </div>
        </div>
        <div className="form__note">
          Note: Transfer from Ethereum Network with Metamask wallet
        </div>
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
