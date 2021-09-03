import React from 'react';

import { Advisors, Description, Questions, Teams, Title } from '../../components/AboutUs';
import { Protocols } from '../../components/HomeDark';

const AboutUs: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <Description />
      <Teams />
      <Protocols />
      <Advisors />
      <Questions />
    </main>
  );
};

export default AboutUs;
