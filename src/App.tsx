import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Indexes } from './components/Admin';
import { GetInModal } from './components/HomeDark';
import AdminIndex from './pages/AdminIndex';
import { EventBanner, Footer, Header } from './components';
import { Admin, Auth, Home, Index, IndexDashboard, StakePage, YdrToken } from './pages';

import './styles/index.scss';
import { MetamaskErrModal, InfoModal } from './components/Modals';

export const App: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className={match.isExact ? 'page-wrapper page-wrapper--home' : 'page-wrapper'}>
      <EventBanner />

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
        <Route exact path="/admin">
          <Indexes />
        </Route>
        <Route exact path="/admin/index/:indexId">
          <AdminIndex />
        </Route>
        <Route exact path="/stake">
          <StakePage />
        </Route>
        <Route exact path="/indexes">
          <IndexDashboard />
        </Route>
      </Switch>
      <MetamaskErrModal />
      <InfoModal />
      <GetInModal />
      <Footer />
    </div>
  );
};
