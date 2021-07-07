import React from 'react';

import iconPlay from '../../../assets/img/icons/icon-play.svg';
import { Button } from '../../index';

// import { Button } from '../../index';
import './Description.scss';

const Description: React.FC = () => {
  return (
    <section className="section description">
      <div className="description__items">
        <div className="description__text--wrapper">
          <span className="description__title">About YDRAGON</span>
          <span className="description__text">
            At YDragon we are committed to solving the problems of DeFi. As investors ourselves, we
            understand how costly and difficult the DeFi space can be to navigate and to create a
            diversified portfolio with an effective risk strategy. With that in mind, we decided to
            create indexes that can give investors the opportunity to own index tokens that offer
            cross-chain yield generation, auto-rebalancing and a simplified way to passively manage
            your funds. <br />
            <br />
            <br /> To further develop our ecosystem and to give more control to our investors we
            created the YDR token. YDR will act as our governance token that would allows you to
            vote on the composition of indexes, thus allowing you to be actively involved in the
            future success of YDragon
          </span>
        </div>
        <div className="description__video">
          <span className="description__video--text">Coming soon</span>
          <img alt="#" src={iconPlay} className="description__video--play" />
          {/* <span className="description__video--info">
            For more info on YDragon{' '}
            <a className="description__video--link" href="/about-us">
              go here
            </a>
          </span> */}
        </div>
      </div>

      <div className="description__btns-row">
        <Button className="description__btn" link="/ydrtoken" styledType="filled">
          Buy YDR
        </Button>
        <Button className="description__btn" styledType="outline">
          Whitepaper
        </Button>
      </div>
    </section>
  );
};

export default Description;
