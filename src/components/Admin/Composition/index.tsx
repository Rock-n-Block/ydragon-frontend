import React from 'react';

import { Button, GradientText, TokenItem } from '../../index';

import './Composition.scss';
import BigNumber from 'bignumber.js/bignumber';
import { IIndexStatus, ITokensDiff } from '../../../pages/Admin';
import nextId from 'react-id-generator';

interface CompositionProps extends IIndexStatus {
  tokens: Array<ITokensDiff>;
}

const Composition: React.FC<CompositionProps> = ({ status, tokens }) => {
  const rebalanceInProgress = status === 'PROCESSING';

  return (
    <section className="section section--admin">
      <h2 className="section__title">
        <GradientText width="190" height="38" text="head" />
      </h2>

      <div className="composition">
        <div className="composition__title">Index composition</div>

        <div className="composition__content">
          {tokens?.map((tokenDiff) => (
            <TokenItem // TODO: change abbr and icon
              key={nextId()}
              icon={tokenDiff.token.image}
              name={tokenDiff.token.name}
              abbr={tokenDiff.token.symbol}
              weight={`${new BigNumber(tokenDiff.token.current_weight)
                .multipliedBy(100)
                .toFixed(2)}%`}
            />
          ))}
        </div>

        <Button
          styledType="filled"
          className="composition__change-btn"
          disabled={rebalanceInProgress}
        >
          Change index
        </Button>
      </div>
    </section>
  );
};

export default Composition;
