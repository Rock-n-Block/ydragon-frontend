import React from 'react';

import './NoPageFound.scss';

const NoPageFound: React.FC = () => {
  return (
    <main className="container page">
      <h2 className="section__title text-outline page-not-found">404</h2>
      <p className="section__sub-title">Page not found</p>
    </main>
  );
};
export default NoPageFound;
