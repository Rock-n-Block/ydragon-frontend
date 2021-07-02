import React from 'react';

import './SmallTableCard.scss';

interface ISmallTableCardProps {
  tokenName: string;
  tokenLogo?: string;
  headerTitle?: string;
  data: Array<Array<string>>;
  index: number;
  hoverFeature?: boolean;
}

const SmallTableCard: React.FC<ISmallTableCardProps> = ({
  tokenName,
  headerTitle,
  index,
  data,
  tokenLogo,
  hoverFeature,
}) => {
  return (
    <section className="small-card" style={{ top: -index * 15 }}>
      <div className="small-card__header">
        <div className="small-card__header--left">
          <div className="small-card__header--title">{headerTitle}</div>
          <div className="small-card__header--subtitle">{tokenName}</div>
        </div>
        <div className="small-card__header--right">
          {tokenLogo && <img src={tokenLogo} alt="token-logo" />}
        </div>
      </div>
      <div className={`small-card__body ${hoverFeature ? 'small-card__body--hover' : ''}`}>
        {data.map((cell, i) => (
          <div className="small-card__cell">
            <div className="small-card__title">{cell[0]}</div>
            <div className={`small-card__subtitle ${i === 0 ? 'text-gradient' : ''}`}>
              {cell[1]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmallTableCard;
