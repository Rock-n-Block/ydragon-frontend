import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Footer, Header, MetamaskErrModal } from './components';
import { Admin, Auth, Home, Index, YdrToken } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className={match.isExact ? 'page-wrapper page-wrapper--home' : 'page-wrapper'}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 0,
          height: 0,
          position: 'absolute',
        }}
        aria-hidden="true"
        focusable="false"
      >
        <linearGradient id="gradient" x2="0" y2="1">
          <stop offset="0" stopColor="#DF3F3A" />
          <stop offset="1" stopColor="#F47C45" />
        </linearGradient>
      </svg>

      <Header />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/auth">
          <Auth />
        </Route>
        <Route exact path="/index/:indexId">
          <Index />
        </Route>
        <Route exact path="/ydrtoken">
          <YdrToken />
        </Route>
        <Route exact path="/admin">
          <Admin />
        </Route>
      </Switch>
      <MetamaskErrModal />
      <Footer />
    </div>
  );
};
