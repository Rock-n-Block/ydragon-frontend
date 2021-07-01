import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Indexes } from './components/Admin';
import { GetInModal, InfoModal, MetamaskErrModal } from './components/Modals';
import AdminIndex from './pages/AdminIndex';
import { Footer, Header, GuardedRoute } from './components';
import { AboutUs, Admin, Home, Index, IndexDashboard, StakePage, YdrToken, NoPageFound } from './pages';


import './styles/index.scss';

export const App: React.FC = () => {
  const main = useRouteMatch();
  const about = useRouteMatch('/about-us');

  const user = !!localStorage?.yd_address || false
  const admin = !!localStorage?.yd_token || false

  const addClass = () => {
    let result;
    if (main.isExact) {
      result = 'page-wrapper page-wrapper--home';
    } else if (about) {
      result = 'page-wrapper page-wrapper--about';
    } else result = 'page-wrapper';
    return result;
  };

  return (
    <div className={addClass()}>
      <Header />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        {/* <Route exact path="/auth">
          <Auth />
        </Route> */}
        <GuardedRoute exact path="/index/:indexId" component={Index} auth={user}/>
        <GuardedRoute exact path="/ydrtoken" component={YdrToken} auth={user}/>
        <GuardedRoute exact path="/admin" component={Admin} auth={admin}/>
        <GuardedRoute exact path="/admin" component={Indexes} auth={admin}/>
        <GuardedRoute exact path="/admin/index/:indexId" component={AdminIndex} auth={admin}/>
        <GuardedRoute exact path="/staking" component={StakePage} auth={user}/>
        <GuardedRoute exact path="/indexes" component={IndexDashboard} auth={user}/>
        <Route exact path="/about-us">
          <AboutUs />
        </Route>
        <Route component={NoPageFound} />
      </Switch>
      <MetamaskErrModal />
      <InfoModal />
      <GetInModal />
      <Footer />
    </div>
  );
}
