import React from 'react';

import { Advisors, Description, Questions, Teams, Title } from '../../components/AboutUs';
import { Partners } from '../../components/HomeDark';

import './AboutUs.scss';

const AboutUs: React.FC = () => {
  return (
    <main className="about-us">
      <div className="container">
        <Title />
        <Description />
      </div>
      <Teams />
      <div className="container">
        <Partners />
        <Advisors />
        <Questions />
      </div>
    </main>
  );
};

export default AboutUs;
