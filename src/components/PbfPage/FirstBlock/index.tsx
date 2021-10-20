import React from 'react';
import { Button, JsonAnimation } from '../../index';

import './FirstBlock.scss';

import cirlceAnim from '../../../assets/json-anim/pbf-circle.json';

const FirstBlock: React.FC = () => {
  return (
    <section className="pbf-first-block section">
      <div className="pbf-first-block__main">
        <div className="pbf-first-block__main-left">
          <div className="pbf-first-block__title">
            <span className="text-gradient">Private</span>
            <span className="text-outline">Blockchain Funds</span>
          </div>
          <div className="pbf-first-block__subtitle">
            Identifying and capturing early blockchain growth to gain exposure to upcoming promising
            projects without the hassle.
          </div>
          <Button
            linkClassName="pbf-first-block__button"
            target="_blank"
            rel="noreferrer noopener"
            link="https://medium.com/ydragon-io/private-blockchain-funds-ydragons-first-product-c385434327cb"
          >
            Learn More
          </Button>
        </div>
        <div className="pbf-first-block__main-right">
          <JsonAnimation animData={cirlceAnim} width="fit-content" />
        </div>
      </div>
      {/* <div className="pbf-first-block__subsection">
        &quot;The YDragon project has currently <span className="text-gradient">XXXX$</span>
        diversified among indexes&quot;. (TVL)
      </div> */}
    </section>
  );
};

export default FirstBlock;
