import React, { Dispatch } from 'react';
import nextId from 'react-id-generator';

import './SmallTableCard.scss';

interface ISmallTableCardProps {
  tokenName: string;
  tokenLogo?: string;
  headerTitle?: string;
  data: Array<Array<string>>;
  index: number;
  hoverFeature?: boolean;
  originData?: any;
  onSelect?: Dispatch<any>;
  isSelected?: boolean;
}

const SmallTableCard: React.FC<ISmallTableCardProps> = ({
  tokenName,
  headerTitle,
  index,
  data,
  tokenLogo,
  hoverFeature,
  originData,
  onSelect,
  isSelected,
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(originData);
    }
  };
  return (
    <section
      tabIndex={0}
      role="button"
      onKeyDown={() => {}}
      className={`small-card ${onSelect ? 'small-card--clickable' : ''} ${
        hoverFeature ? 'small-card--hover' : ''
      } ${isSelected && 'small-card--selected'}`}
      style={{ top: -index * 15 }}
      onClick={handleSelect}
    >
      <div className="small-card__header">
        <div className="small-card__header--left">
          <div className="small-card__header--title">{headerTitle}</div>
          <div className="small-card__header--subtitle">{tokenName}</div>
        </div>
        <div className="small-card__header--right">
          {tokenLogo && <img src={tokenLogo} alt="token-logo" />}
        </div>
      </div>
      <div className="small-card__body">
        {data.map((cell, i) => (
          <div className="small-card__cell" key={nextId()}>
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
