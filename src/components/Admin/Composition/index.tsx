import React from 'react';
import nextId from 'react-id-generator';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { IIndexStatus, ITokensDiff } from '../../../pages/Admin';
import { useMst } from '../../../store/store';
import { Button, TokenItem } from '../../index';

import './Composition.scss';

interface CompositionProps extends IIndexStatus {
  tokens: Array<ITokensDiff>;
}

const Composition: React.FC<CompositionProps> = observer(({ status, tokens }) => {
  const { modals } = useMst();
  const rebalanceInProgress = status === 'PROCESSING';
  const handleRebalanceOpen = () => {
    modals.rebalance.open();
  };

  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">head</h2>

      <div className="composition">
        <div className="composition__title">Index composition</div>

        <div className="composition__content">
          {tokens?.map((tokenDiff) => (
            <TokenItem
              key={nextId()}
              icon={tokenDiff.token.image}
              name={tokenDiff.token.name}
              abbr={tokenDiff.token.symbol}
              weight={`${new BigNumber(tokenDiff.new_weight).multipliedBy(100).toFixed(2)}%`}
            />
          ))}
        </div>

        <Button
          styledType="filled"
          className="composition__change-btn"
          onClick={handleRebalanceOpen}
          disabled={rebalanceInProgress}
        >
          Rebalance index
        </Button>
      </div>
    </section>
  );
});

export default Composition;
