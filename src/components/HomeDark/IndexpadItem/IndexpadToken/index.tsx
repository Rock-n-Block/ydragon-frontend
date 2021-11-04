import React from 'react';
import { IIndexpadToken } from '../../Indexpad';
import './IndexpadToken.scss';
import BigNumber from 'bignumber.js/bignumber';
import Tippy from '@tippyjs/react';

interface IProps {
  token: IIndexpadToken;
}

const IndexpadToken: React.FC<IProps> = ({ token }) => {
  return (
    <div className="indexpad-token">
      <div className="indexpad-token__header">
        <div className="indexpad-token__img">
          <img src={token.image} alt="" width={42} height={42} />
        </div>
        <div className="indexpad-token__percentage">
          <span className="text-gradient">
            {new BigNumber(token.unit_weight).multipliedBy(100).toFixed(2)}%
          </span>
        </div>
      </div>

      <Tippy content={token.name}>
        <p className="indexpad-token__footer text-ellipsis">{token.name}</p>
      </Tippy>
    </div>
  );
};

export default IndexpadToken;
