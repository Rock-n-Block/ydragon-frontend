import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../../store/store';
import { Button, GradientText } from '../../index';

import './Rebalance.scss';
import { IIndexStatus, ITokensDiff } from '../../../pages/Admin';
import BigNumber from 'bignumber.js/bignumber';

interface RebalanceProps extends IIndexStatus {
  tokens: Array<ITokensDiff>;
}

const Rebalance: React.FC<RebalanceProps> = observer(({ status, tokens }) => {
  const { modals } = useMst();
  const rebalanceInProgress = status === 'PROCESSING';
  const handleRebalanceOpen = () => {
    modals.rebalance.open();
  };
  return (
    <section className="section section--admin">
      <h2 className="section__title">
        <GradientText width="648" height="38" text="Index rebalance" />
      </h2>

      <div className="rebalance-table">
        <div className="rebalance-table__row rebalance-table__row--head">
          <div className="rebalance-table__col">Token</div>
          <div className="rebalance-table__col">
            Quantity <br /> per Index
          </div>
          <div className="rebalance-table__col">Token Price</div>
          <div className="rebalance-table__col">Current Price Allocation</div>
          <div className="rebalance-table__col">
            Total Price <br /> per Index
          </div>
        </div>

        <div className="rebalance-table__content">
          {tokens&&(
            tokens?.map((tokenDiff:ITokensDiff)=>(
              <div className="rebalance-table__row">
                <div className="rebalance-table__col rebalance-table__first-col">
                  <img
                    src={tokenDiff.token.image}
                    className="rebalance-table__image"
                    alt={`${tokenDiff.token.name} logo`}
                  />
                  <div className="rebalance-table__token">{tokenDiff.token.name}</div>
                </div>
                <div className="rebalance-table__col">
                  <div className="rebalance-table__quantity">
                    {new BigNumber(tokenDiff.token.count)
                      .multipliedBy(new BigNumber(10).pow(-tokenDiff.token.decimal))
                      .toFixed(2)}
                  </div>
                </div>
                <div className="rebalance-table__col">
                  <div className="rebalance-table__price">${tokenDiff.token.price_for_one}</div>
                </div>
                <div className="rebalance-table__col">
                  <div className="rebalance-table__price">
                    {new BigNumber(tokenDiff.token.current_weight).multipliedBy(100).toFixed(2)}%
                  </div>
                </div>
                <div className="rebalance-table__col">
                  <div className="rebalance-table__price">${tokenDiff.token.price_total}</div>
                </div>
              </div>
            ))
          )}

          <div className="rebalance-table__btn-row">
            <Button onClick={handleRebalanceOpen} disabled={rebalanceInProgress}>
              rebalance index
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Rebalance;
