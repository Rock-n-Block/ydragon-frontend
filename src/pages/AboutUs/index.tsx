import React from 'react';

import { Advisors, Description, Questions, Teams, Title } from '../../components/AboutUs';

const AboutUs: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <Description />
      <Teams />
      <Advisors />
      <Questions />
    </main>
  );
};

export default AboutUs;
