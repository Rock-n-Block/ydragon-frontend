import React from 'react';
import { Button } from '../../../index';
import indexProducts from '../../../../assets/img/ecosystem/index-products.png';

const IndexProducts: React.FC = () => {
  return (
    <div className="ecosystem__element">
      <div className="ecosystem__info">
        <h3 className="ecosystem__element-title">YDragon Products</h3>
        <p className="ecosystem__element-text">
          The YDragon centrepiece is our Index offerings, available on the YDragon IndexPad. This is
          where ‘Defi-Made-Simple’ really shines; instant diversification and automated
          passive-income in one, simple purchase.
        </p>
        <p className="ecosystem__element-text">
          A YDragon Index contains extensively researched, promising and high-performing assets in a
          given blockchain or niche, and our native asset and governance token, YDR. Head to the
          IndexPad to view our Index options.
        </p>
        <Button className="ecosystem__element-btn">Learn More</Button>
      </div>
      <img width={354} height={320} src={indexProducts} alt="egs" className="ecosystem__img" />
    </div>
  );
};
export default IndexProducts;
