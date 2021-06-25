import React from 'react';

import { Description, Questions, Teams, Title } from '../../components/AboutUs';

const AboutUs: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <Description />
      <Teams />
      <Questions />
    </main>
  );
};

export default AboutUs;