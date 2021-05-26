import React from 'react';

import { GradientText } from '../../index';

const About: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section__title">
        <GradientText width="358" height="36" text="About Us" />
      </h2>

      <div className="section__text-row">
        <p className="section__text">
          We are a diverse group of hackathon winners and ﬁntech leaders from Australia, China and
          Malaysia. We’ve been building DeFi applications since 2017, unfortunately for a long time
          DeFi was not popular and we have always seen the biggest problem of DeFi products as a
          technology barrier thus we dedicated YDragon to solve this problem.
        </p>
      </div>
    </section>
  );
};

export default About;
