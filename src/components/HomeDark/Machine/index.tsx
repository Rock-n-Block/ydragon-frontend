import React from 'react';

import image from '../../../assets/img/machine-dark.svg';

import './Machine.scss';

const Machine: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section__title text-outline">YDragon & the YDR Token</h2>
      <p className="section__sub-title">Our core platform products</p>

      <div className="machine">
        <p className="machine__descr">
          YDragon is an ecosystem that offers investors the opportunity to own a diversified
          portfolio of the best performing cryptocurrencies with only one token. Holders of YDragon
          indexes can generate high yield, passive income on collateralised assets through our
          staking platform.
          <br /> <br />
          Within our ecosystem we have created YDR, our governance token that enables holders to
          vote on the future composition of all platform indexes. For more information on YDR,
          please{' '}
          <span className="isDisabled ">
            <a href="/" className="link">
              read here
            </a>
          </span>
          .
        </p>

        <div className="machine__img">
          <img src={image} alt="" width="686" height="502" />
        </div>
      </div>
    </section>
  );
};

export default Machine;
