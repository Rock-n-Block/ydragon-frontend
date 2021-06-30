import React from 'react';
import './SmallCard.scss';
import { IUserIndex } from '../index';
import logo from '../../../assets/img/icons/logo.svg';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';

// colors for line in the card
const colorsClassNames = ['yellow', 'blue', 'red', 'white'];

const SmallCard: React.FC<IUserIndex> = ({
  name,
  market_cap,
  price,
  id,
  day,
  week,
  month,
  total,
  tokens,
}) => {
  return (
    <section className="index-small-card">
      <div className="index-small-card__header">
        <div className="index-small-card__header--logo">
          <img src={logo} alt="ydr-logo" />
        </div>
        <Link to={`/index/${id}`} className="index-small-card__header--name">
          {name}
        </Link>
      </div>

      <div className="index-small-card__info">
        <div className="index-small-card__info--market-cap">
          <div className="index-small-card__info--market-cap__title">Market cap</div>
          <div className="index-small-card__info--market-cap__value">${market_cap}</div>
        </div>
        <div className="index-small-card__info--price">
          <div className="index-small-card__info--price__title">Price</div>
          <div className="index-small-card__info--price__value">${price}</div>
        </div>
      </div>

      <div className="index-small-card__market-cup">
        <div className="index-small-card__market-cup--item">
          <div className="index-small-card__market-cup--item__title">1 Day</div>
          <div
            className={`index-small-card__market-cup--item__value ${
              day > 0
                ? 'index-small-card__market-cup--item__value--up'
                : 'index-small-card__market-cup--item__value--down'
            }`}
          >
            {new BigNumber(day).multipliedBy(100).toFixed(2)}%
          </div>
        </div>
        <div className="index-small-card__market-cup--item">
          <div className="index-small-card__market-cup--item__title">1 month</div>
          <div
            className={`index-small-card__market-cup--item__value ${
              day > 0
                ? 'index-small-card__market-cup--item__value--up'
                : 'index-small-card__market-cup--item__value--down'
            }`}
          >
            {new BigNumber(week).multipliedBy(100).toFixed(2)}%
          </div>
        </div>
        <div className="index-small-card__market-cup--item">
          <div className="index-small-card__market-cup--item__title">3 month</div>
          <div
            className={`index-small-card__market-cup--item__value ${
              day > 0
                ? 'index-small-card__market-cup--item__value--up'
                : 'index-small-card__market-cup--item__value--down'
            }`}
          >
            {new BigNumber(month).multipliedBy(100).toFixed(2)}%
          </div>
        </div>
        <div className="index-small-card__market-cup--item">
          <div className="index-small-card__market-cup--item__title">Since Inception</div>
          <div
            className={`index-small-card__market-cup--item__value ${
              day > 0
                ? 'index-small-card__market-cup--item__value--up'
                : 'index-small-card__market-cup--item__value--down'
            }`}
          >
            {new BigNumber(total).multipliedBy(100).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="index-small-card__percents">
        {tokens.map((token, i) => (
          <div className={`index-small-card__percents--item ${colorsClassNames[i > 3 ? 3 : i]}`}>
            <div className="index-small-card__percents--item__title">{token.symbol}</div>
            <div
              className="index-small-card__percents--item__line"
              style={{
                width: `${new BigNumber(token.current_weight).multipliedBy(100).toString()}%`,
              }}
            >
              <div className="index-small-card__percents--item__line--body" />
              <div className="index-small-card__percents--item__line--number">
                {new BigNumber(token.current_weight).multipliedBy(100).toString()}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmallCard;
