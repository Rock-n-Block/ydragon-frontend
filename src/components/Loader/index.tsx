import React from 'react';

import { Spinner } from '..';

import './Loader.scss';

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <Spinner loading />
    </div>
  );
};

export default Loader;
