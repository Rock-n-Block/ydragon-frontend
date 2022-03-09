import React from 'react';
import { Button } from '../../../index';
import products from '../../../../assets/img/ecosystem/products.png';

const Products: React.FC = () => {
  return (
    <div className="ecosystem__element">
      <img width={264} height={302} src={products} alt="coins" className="ecosystem__img" />
      <div className="ecosystem__info">
        <h3 className="ecosystem__element-title">YDragon Products</h3>
        <p className="ecosystem__element-text">
          The YDragon ecosystem offers a number of products within the Defi space, and as we grow,
          our product offerings will grow with us. Read on for an overview of each product category
          and key information around each offering within the category.
        </p>
        <Button className="ecosystem__element-btn">Learn More</Button>
      </div>
    </div>
  );
};
export default Products;
