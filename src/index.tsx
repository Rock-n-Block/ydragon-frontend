// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-param-reassign
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Connector from './services/walletConnect';
import { Provider, rootStore } from './store/store';
import ScollToTop from './utils/ScollToTop';
// import App from './App';

import spinnerLogo from './assets/img/icons/logo.svg';
import './loader.scss';

const AppNew = React.lazy(() => import('./App'));

const Loader = () => (
  <div className="loader-wrapper">
    <div className="loader-container">
      <img className="loader-logo" alt="loading" src={spinnerLogo} width="50" height="50" />
      <div className="loader" />
    </div>
  </div>
);

ReactDOM.render(
  <Provider value={rootStore}>
    <Router>
      <ScollToTop>
        <Connector>
          <Suspense fallback={<Loader />}>
            <AppNew />
          </Suspense>
        </Connector>
      </ScollToTop>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
