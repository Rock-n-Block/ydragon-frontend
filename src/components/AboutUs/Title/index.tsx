import React from 'react';

import './Title.scss';

const Title: React.FC = () => {
  return (
    <section className="section about-us">
      <div className="about-us__title-wrapper">
        <h1 className="about-us__title text-outline">YDRAGON</h1>
        <span className="about-us__sub-title">ABOUT US</span>
      </div>
    </section>
  );
};

export default Title;
