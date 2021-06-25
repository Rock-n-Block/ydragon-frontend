import React from 'react';
import './IndexCardMobile.scss';
import { Link } from 'react-router-dom';

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
  return (
    <div className="index-card-mobile">
      <div className="index-card-mobile__name">
        <div className="index-card-mobile__title">Name</div>
        <Link to={`/admin/index/${name.id}`} className="index-card-mobile__value">
          {name.name}
        </Link>
      </div>
      <div className="index-card-mobile__info">
        <div className="index-card-mobile__cap">
          <div className="index-card-mobile__title">Market cap</div>
          <div className="index-card-mobile__value">{cap}</div>
        </div>
        <div className="index-card-mobile__price">
          <div className="index-card-mobile__title">Price</div>
          <div className="index-card-mobile__value">{price}</div>
        </div>
      </div>
      <div className="index-card-mobile__created">
        <div className="index-card-mobile__title">Created</div>
        <div className="index-card-mobile__value">{created}</div>
      </div>
    </div>
  );
};
