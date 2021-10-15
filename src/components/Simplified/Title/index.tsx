import React from 'react';
import './Title.scss';

import TitleImg from '../../../assets/img/simplified/Simplified-title.svg';

const Title: React.FC = () => {
  return (
    <section className="section simplified">
      <div className="simplified__title-wrapper">
        <h1 className="simplified__title text-outline">YDRAGON</h1>
        <p className="simplified__sub-title">SIMPLIFIED</p>
      </div>
      <img src={TitleImg} alt='' className="simplified__img"/>
      <div className="simplified__main-message-wrapper">
        <div className="simplified__main-message">
          <p className="simplified__main-message-text">A breakdown of all you need to know to start investing - <strong>YDragon Simplified</strong>.</p>
        </div>
      </div>
    </section>
  )
}

export default Title;