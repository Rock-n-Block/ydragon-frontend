import React from 'react';

import './FirstBlock.scss';

import { ReactComponent as Img } from '../../../assets/img/staking-page/first-block-img.svg';

const FirstBlock: React.FC = React.memo(() => {
  return (
    <section className="first-block section">
      <div className="first-block_left">
        <h2 className="text-gradient first-block_title ">Stake & earn.</h2>
        <h3 className="first-block_subtitle text-outline">Conquer with ydragon</h3>
      </div>
      <div className="first-block_right">
        <Img />
      </div>
    </section>
  );
});

export default FirstBlock;
