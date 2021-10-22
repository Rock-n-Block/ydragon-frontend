import React from 'react';
import { observer } from 'mobx-react';

import { Button, JsonAnimation } from '../../index';
import { useMst } from '../../../store/store';

import './FirstBlock.scss';

import cirlceAnim from '../../../assets/json-anim/pbf-circle.json';
import cirlceAnimLight from '../../../assets/json-anim/pbf-circle-light.json';

const FirstBlock: React.FC = observer(() => {
  const { theme } = useMst();

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
          <JsonAnimation
            animData={theme.value === 'light' ? cirlceAnimLight : cirlceAnim}
            width="fit-content"
          />
        </div>
      </div>
      {/* <div className="pbf-first-block__subsection">
        &quot;The YDragon project has currently <span className="text-gradient">XXXX$</span>
        diversified among indexes&quot;. (TVL)
      </div> */}
    </section>
  );
});

export default FirstBlock;
