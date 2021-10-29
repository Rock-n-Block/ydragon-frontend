import React from 'react';
import Tippy from '@tippyjs/react';
import BigNumber from 'bignumber.js/bignumber';

import { formatAmount } from '../../../../../utils/formatAmount';

interface IStakingTableRowCellProps {
  title: string;
  value: string;
  textType: 'MER' | 'gradient';
  symbol: string;
  usdPrice?: string;
}

const StakingTableRowCell: React.FC<IStakingTableRowCellProps> = ({
  title,
  value,
  textType,
  symbol,
  usdPrice,
}) => {
  return (
    <div className="staking-table_row__cell">
      <div className="staking-table_row__cell__title">{title}</div>
      <Tippy
        content={
          symbol === '$' && usdPrice
            ? `$ ${formatAmount(new BigNumber(value).multipliedBy(usdPrice).toString(), 6)}`
            : `${formatAmount(new BigNumber(value).toString())} ${symbol}`
        }
      >
        <div className={`staking-table_row__cell__value text-${textType}`}>
          {symbol === '$' && usdPrice
            ? `$ ${formatAmount(new BigNumber(value).multipliedBy(usdPrice).toString(), 6)}`
            : `${formatAmount(value, 6)} ${symbol}`}
        </div>
      </Tippy>
    </div>
  );
};

export default StakingTableRowCell;
