import React from 'react';
import { observer } from 'mobx-react-lite';

import spinnerLogo from '../../assets/img/icons/logo.svg';

import './Loader.scss';

interface ILoaderProps {
  loading: boolean;
}

const Loader: React.FC<ILoaderProps> = observer(({ loading }) => {
  return loading ? (
    <div className="loader-container">
      <img className="loader-logo" alt="loading" src={spinnerLogo} width="50" height="50" />
      <div className="loader" />
    </div>
  ) : (
    <></>
  );
});

export default Loader;
