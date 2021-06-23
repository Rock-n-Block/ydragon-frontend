import React from 'react';

import { Description, Features, Questions, Title } from '../../components/AboutUs';

const AboutUs: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <Description />
      <Features />
      <Questions />
    </main>
  );
};

export default AboutUs;
