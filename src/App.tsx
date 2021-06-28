import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Indexes } from './components/Admin';
import { GetInModal, InfoModal, MetamaskErrModal } from './components/Modals';
import AdminIndex from './pages/AdminIndex';
import { EventBanner, Footer, Header } from './components';
import { AboutUs, Admin, Auth, Home, Index, IndexDashboard, StakePage, YdrToken } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  const main = useRouteMatch();
  const about = useRouteMatch('/about-us')

  const addClass = () => {
    let result
    if (main.isExact) {
      result = 'page-wrapper page-wrapper--home'
    } else if (about) {
      result = 'page-wrapper page-wrapper--about'
    } else result = 'page-wrapper'
    return result
  }

  return (
    <div className={addClass()}>
    {/* <div className={main ? 'page-wrapper page-wrapper--home' : about ? 'page-wrapper page-wrapper--about' :'page-wrapper'}> */}
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
        <Route exact path="/about-us">
          <AboutUs />
        </Route>
      </Switch>
      <MetamaskErrModal />
      <InfoModal />
      <GetInModal />
      <Footer />
    </div>
  );
};
