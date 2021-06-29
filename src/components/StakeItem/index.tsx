import React from 'react';
import './StakeItem.scss';
import { TokenMini } from '../index';
import { TokenMiniProps } from '../TokenMini';

interface StakeItemProps {
  item: IStakeItem;
  active?: boolean;
  onClick: () => void;
}
export interface IStakeItem {
  token: TokenMiniProps;
  available: string;
}
const StakeItem: React.FC<StakeItemProps> = ({ item, active = false, onClick }) => {
  return (
    <div
      className={`stake-item ${active ? 'stake-item--active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onClick}
    >
      <TokenMini icon={item.token.icon} name={item.token.name} symbol={item.token.symbol} />

      <div className="stake-item__amount">{item.available}</div>
    </div>
  );
};

export default StakeItem;
