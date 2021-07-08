import React, { useState } from 'react';

import { Button } from '../../index';

import './Main.scss';

const Main: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pickTooltip, setPickTooltip] = useState<number | undefined>(undefined);
  const user = !!localStorage?.yd_address || false;

  const onClickHandler = (e: any) => {
    if (!user) {
      e.preventDefault();
      setShowTooltip(true);
    }
  };
  const onFocusHandler = (value: number) => {
    setPickTooltip(value);
  };
  const onBlurHandler = () => {
    setShowTooltip(false);
  };
  return (
    <section className="section home">
      <div className="home__title-wrapper">
        <h1 className="home__title text-outline">YDRAGON</h1>
        <span className="home__sub-title">DeFi made simple</span>
      </div>

      <p className="home__descr">
        YDragon is a cross-chain index ecosystem with yield bearing collateral, providing a true{' '}
        <br /> interoperable cross-asset experience. Made by investors, for investors.
      </p>

      <div className="home__btns-row">
        <Button
          linkClassName="home__btn"
          link="/ydrtoken"
          onClick={(e) => onClickHandler(e)}
          onBlur={onBlurHandler}
          onFocus={() => onFocusHandler(1)}
        >
          {pickTooltip === 1 && !user && showTooltip && (
            <div className="ant-tooltip ant-tooltip-placement-top">
              <div className="ant-tooltip-content">
                <div className="ant-tooltip-arrow">
                  <span className="ant-tooltip-arrow-content" />
                </div>
                <div className="ant-tooltip-inner" role="tooltip">
                  Please login
                </div>
              </div>
            </div>
          )}
          Buy YDR
        </Button>
        <Button
          className="home__btn"
          styledType="outline"
          onClick={(e) => onClickHandler(e)}
          onBlur={onBlurHandler}
          onFocus={() => onFocusHandler(2)}
        >
          {pickTooltip === 2 &&!user && showTooltip && (
            <div className="ant-tooltip ant-tooltip-placement-top">
              <div className="ant-tooltip-content">
                <div className="ant-tooltip-arrow">
                  <span className="ant-tooltip-arrow-content" />
                </div>
                <div className="ant-tooltip-inner" role="tooltip">
                  Please login
                </div>
              </div>
            </div>
          )}
          Whitepaper
        </Button>
      </div>

      <div className="home__currently-price">
        &quot;The YDragon project has currently <span>XXXX$</span> diversified among indexes&quot;.
        (TVL)
      </div>
    </section>
  );
};

export default Main;
