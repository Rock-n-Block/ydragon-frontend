import React from 'react';
import { Button } from '../../index';

import './FirstBlock.scss';

import { ReactComponent as Logo } from '../../../assets/img/pbf-page/first-block-logo.svg';

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
          <Button linkClassName="pbf-first-block__button" link="/simplified">
            Learn More
          </Button>
        </div>
        <div className="pbf-first-block__main-right">
          <Logo />
        </div>
      </div>
      <div className="pbf-first-block__subsection">
        &quot;The YDragon project has currently <span className="text-gradient">XXXX$</span>
        diversified among indexes&quot;. (TVL)
      </div>
    </section>
  );
};

export default FirstBlock;
