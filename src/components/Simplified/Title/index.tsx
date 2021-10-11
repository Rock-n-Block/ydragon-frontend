import React from 'react';
import './Title.scss';

import TitleImg from '../../../assets/img/simplified/Simplified-title.svg';

const Title: React.FC = () => {
  return (
    <section className="section simplified">
      <div className="simplified__title-wrapper">
        <h1 className="simplified__title text-outline">YDRAGON</h1>
        <span className="simplified__sub-title">SIMPLIFIED</span>
      </div>
      <img src={TitleImg} alt='' className="simplified__img"/>
      <div className="simplified__main-message-wrapper">
        <div className="simplified__main-message">
          <span className="simplified__main-message-text">A breakdown of all you need to know to start investing - <strong>YDragon Simplified</strong>.</span>
        </div>
      </div>
    </section>
  )
}

export default Title;