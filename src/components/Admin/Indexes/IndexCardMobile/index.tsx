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
    <section className="index-card-mobile">
      <div className="index-card-mobile__name">
        <h3 className="index-card-mobile__title">Name</h3>
        <Link to={`/admin/index/${name.id}`} className="index-card-mobile__value">
          {name.name}
        </Link>
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
