// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-param-reassign
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Connector from './services/walletConnect';
import { Provider, rootStore } from './store/store';
import { App } from './App';
import ScollToTop from './utils/ScollToTop';

ReactDOM.render(
  <Provider value={rootStore}>
    <Router>
      <ScollToTop>
        <Connector>
          <App />
        </Connector>
      </ScollToTop>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
