import React from 'react';

import {
  Title,
  Description,
  Features
} from '../../components/AboutUs';

const AboutUs: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <Description />
      <Features />
    </main>
  );
};

export default AboutUs;
