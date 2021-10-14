import React from 'react';

import './Purpose.scss';
import { Card } from '../components';

const Purpose: React.FC = () => {

  return (
    <section className="section purpose">
      <h2 className="section__title text-outline">PURPOSE</h2>
      <div className="purpose__purpose-wrapper">
        <Card />
      </div>
    </section>
  )
}

export default Purpose;