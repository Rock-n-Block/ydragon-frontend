import React from 'react';

import { Advisors, Description, Questions, Teams, Title } from '../../components/AboutUs';
import { Partners } from '../../components/HomeDark';

const AboutUs: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <Description />
      <Teams />
      <Partners />
      <Advisors />
      <Questions />
    </main>
  );
};

export default AboutUs;
