import React from 'react';

import {
  Title,
  Description,
  Features,
  Questions
} from '../../components/AboutUs';

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
