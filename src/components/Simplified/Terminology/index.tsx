import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MainVideo from '../../../assets/video/YDragon.mp4';
import './Terminology.scss';

interface IContent {
  title: string;
  text: string;
}

const Terminology: React.FC = () => {
  const content: Array<IContent> = [
    {
      title: 'Portfolio',
      text: `Simply put, your collection of assets. Again, in this case, cryptocurrency tokens`
    },
    {
      title: 'Index Fund',
      text: `A collection of assets gathered in a basket, and the value mimicked by a single token`
    },
    {
      title: 'Passive Income',
      text: `Money made without doing any work. Your money makes you money.`
    },
    {
      title: 'Governance token',
      text: `A native token offering the power to vote on the future of a number of areas of the project`
    },

  ]
  return (
    <section className="section terminology">
      <h2 className="section__title text-outline">Other terminology</h2>
      <div className="terminology__title-wrapper">
        <div className="terminology__title-container">
          <p className="terminology__title-text">Some crypto language is tricky, so we have compiled a list of potentially confusing words & phrases that you may find in the <strong>crypto space</strong></p>
        </div>
      </div>
      <div className="terminology__content-wrapper">
      {
        content.map((card: IContent) => 
          <div className="terminology__content">
            <h4 className="terminology__content-title">{card.title}</h4>
            <p className="terminology__content-text">{card.text}</p>
          </div>
        )
      }
      </div>
      <div className="terminology__video-wrapper">
        <div className="terminology__video-content">
          <h4 className="terminology__content-title">Liquidity Pools</h4>
          <p className="terminology__content-text">Pools of tokens that provide funding to exchanges,  to assist with the operations of those exchanges. Check out this great explanation from Finematics 
          <a href="/"> on Youtube</a> 
          </p>
          <video
            className="terminology__video"
            width={462}
            height={312}
            controls
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={MainVideo} type="video/mp4" />
            {/* <track default kind="captions" srcLang="en" /> */}
          </video>
        </div>
        <div className="terminology__video-content">
          <h4 className="terminology__content-title">Liquidity Pools</h4>
          <p className="terminology__content-text">Pools of tokens that provide funding to exchanges,  to assist with the operations of those exchanges. Check out this great explanation from Finematics 
          <a href="/"> on Youtube</a> 
          </p>
          <video
            className="terminology__video"
            width={462}
            height={312}
            controls
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={MainVideo} type="video/mp4" />
            {/* <track default kind="captions" srcLang="en" /> */}
          </video>
        </div>
      </div>
    </section>
  )
}

export default Terminology;