import React from 'react';
import nextId from 'react-id-generator';

import Question from './Question';

import './Questions.scss';

const Questions: React.FC = () => {
  const faqs = [
    {
      title: 'What is YDragon?',
      text: (
        <>
          YDragon is an ecosystem of financial products aimed at risk reduction and yield
          optimization, all the while leveraging the composability of decentralized finance. Its
          product offering includes first and foremost a spectrum of indexes spread across various
          blockchains whose assets are locked into hand-picked yield farming protocols. Users
          investing in YDragon indexes are thereby investing in a selection of assets, with the
          option of further investing in a basket of yield farming protocols tied to that index.
        </>
      ),
    },
    {
      title: 'What is an index fund?',
      text: (
        <>
          An index is a fund whose performance tracks a specified basket of underlying investments.
          The performance of the index fund is based on the collective movements of the assets held
          within that fund.
        </>
      ),
    },
    {
      title: 'How many indexes are on YDragon?',
      text: (
        <>
          YDragon will launch with an initial index, the B5 Index on Binance Smart Chain, but we
          have plans to expand our ecosystem in the near future to other chains.
        </>
      ),
    },
    {
      title: 'Are all indexes based on the same blockchain?',
      text: (
        <>
          Our initial index will initially be composed of assets found on the same chain, but as we
          develop we will be creating indexes that will be comprised of assets spread across
          multiple chains.
        </>
      ),
    },
    {
      title: 'Who decides on the composition of future indexes?',
      text: (
        <>
          YDragon will have an internal council set up to come up with changes to existing indexes
          and the formation of new ones. The YDR token will provide governance functionality, whose
          holders will be able to have a say and vote on these decisions.
        </>
      ),
    },
    {
      title: 'What is an Initial Minting Event?',
      text: (
        <>
          A minting event is simply a period during which a user can purchase shares in an index
          that is going live shortly after the end of the minting event. Participating in a minting
          event awards the user select benefits exclusive to a particular minting event. Details
          about these benefits will be announced before every minting event.
          {/* Read more{' '}
          <a className="question__text--link" href="about-us">
            here
          </a> */}
        </>
      ),
    },
  ];
  return (
    <section className="section questions" id="FAQ">
      <div className="questions__title-wrapper">
        <h1 className="questions__title text-outline">FAQ</h1>
      </div>
      <div className="questions__wrapper">
        {faqs.map((faq) => (
          <Question title={faq.title} key={nextId()}>
            {' '}
            {faq.text}{' '}
          </Question>
        ))}
      </div>
    </section>
  );
};

export default Questions;
