import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

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
import { useMst } from '../../store/store';

const Routes: React.FC = observer(() => {
  const { networks } = useMst();

  const user = !!localStorage.getItem('yd_address') || false;
  const admin = !!localStorage.getItem('yd_token') || false;
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      {/* <Route exact path="/index/:indexId">
        <Index />
      </Route> */}
      <GuardedRoute
        component={Index}
        exact
        path="/index/:indexId"
        auth={networks.currentNetwork === 'bnb'}
      />
      <Route exact path="/ydrtoken">
        <YdrToken />
      </Route>
      <GuardedRoute
        exact
        path="/admin"
        component={Admin}
        auth={admin && networks.currentNetwork === 'bnb'}
      />
      <GuardedRoute
        exact
        path="/admin"
        component={Indexes}
        auth={admin && networks.currentNetwork === 'bnb'}
      />
      <GuardedRoute
        exact
        path="/admin/index/:indexId"
        component={AdminIndex}
        auth={admin && networks.currentNetwork === 'bnb'}
      />
      <GuardedRoute exact path="/staking" component={StakingPage} auth={user} />

      <GuardedRoute
        exact
        path="/indexes"
        auth={networks.currentNetwork === 'bnb'}
        component={IndexDashboard}
      />
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
});
export default Routes;
