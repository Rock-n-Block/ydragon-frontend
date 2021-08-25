import React from 'react';
import { useHistory } from 'react-router-dom';

import './IndexCardMobile.scss';

interface IIndexCardProps {
  cap: string;
  created: string;
  key: number;
  name: {
    id: number;
    name: string;
  };
  price: string;
}

export const IndexCardMobile: React.FC<IIndexCardProps> = ({ name, cap, price, created }) => {
  const history = useHistory();

  const handleRowClick = () => {
    history.push(`/admin/index/${name.id}`);
  };

  return (
    <section
      role="button"
      onClick={handleRowClick}
      onKeyDown={handleRowClick}
      tabIndex={0}
      className="index-card-mobile"
    >
      <div className="index-card-mobile__name">
        <h3 className="index-card-mobile__title">Name</h3>
        <span className="index-card-mobile__value">{name.name}</span>
      </div>
      <div className="index-card-mobile__info">
        <div className="index-card-mobile__cap">
          <h3 className="index-card-mobile__title">Market cap</h3>
          <div className="index-card-mobile__value">{cap}</div>
        </div>
        <div className="index-card-mobile__price">
          <div className="index-card-mobile__title">Price</div>
          <div className="index-card-mobile__value">{price}</div>
        </div>
      </div>
      <div className="index-card-mobile__created">
        <h3 className="index-card-mobile__title">Created</h3>
        <div className="index-card-mobile__value">{created}</div>
      </div>
    </section>
  );
};
