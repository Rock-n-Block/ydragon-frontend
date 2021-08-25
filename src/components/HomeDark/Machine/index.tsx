import React from 'react';

import image from '../../../assets/img/gif/PLATFORM__YDRAGON.gif';

import './Machine.scss';

const Machine: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section__title text-outline">YDragon & the YDR Token</h2>
      <p className="section__sub-title">Our core platform products</p>

      <div className="machine">
        <p className="machine__descr">
          YDragon is a platform offering you a range of opportunities to own a diverse selection of
          the best performing and most promising cryptocurrencies with a single token. Within this
          selection there will be one ever-present token; YDR.
          <br /> <br />
          YDR is central to our vision and will become central to yours, due to its utility and
          governance characteristics. As an investor, you will always hold YDR, which means you will
          hold the power to influence future decisions on YDragon indexes and their assets.
          {/* For more information on YDR,
          please read here{' '}
           <span className="isDisabled ">
            <a href="/" className="link">
              read here
            </a>
          </span> */}
        </p>

        <div className="machine__img">
          <img src={image} alt="machine" width="600" height="426" />
        </div>
      </div>
    </section>
  );
};

export default Machine;
