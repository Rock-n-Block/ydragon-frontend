import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  AboutUs,
  Admin,
  AdminIndex,
  Home,
  Index,
  IndexDashboard,
  NoPageFound,
  PbfPage,
  Simplified,
  StakingPage,
  YdrToken,
} from '../../pages';
import { GuardedRoute } from '../../components';
import { Indexes } from '../../components/Admin';

const Routes: React.FC = () => {
  const user = !!localStorage.getItem('yd_address') || false;
  const admin = !!localStorage.getItem('yd_token') || false;
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/index/:indexId">
        <Index />
      </Route>
      <Route exact path="/ydrtoken">
        <YdrToken />
      </Route>
      <GuardedRoute exact path="/admin" component={Admin} auth={admin} />
      <GuardedRoute exact path="/admin" component={Indexes} auth={admin} />
      <GuardedRoute exact path="/admin/index/:indexId" component={AdminIndex} auth={admin} />
      <GuardedRoute exact path="/staking" component={StakingPage} auth={user} />

      <Route exact path="/indexes">
        <IndexDashboard />
      </Route>
      <Route exact path="/about-us">
        <AboutUs />
      </Route>
      <Route exact path="/simplified">
        <Simplified />
      </Route>
      <Route exact path="/pbf">
        <PbfPage />
      </Route>
      <Route component={NoPageFound} />
    </Switch>
  );
};
export default Routes;
