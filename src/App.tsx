import React, { useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Indexes } from './components/Admin';
import { GetInModal, InfoModal, MetamaskErrModal } from './components/Modals';
import AdminIndex from './pages/AdminIndex';
import { useMst } from './store/store';
import { Footer, GuardedRoute, Header } from './components';
import {
  AboutUs,
  Admin,
  Home,
  Index,
  IndexDashboard,
  NoPageFound,
  StakePage,
  YdrToken,
} from './pages';

import './styles/index.scss';

export const App: React.FC = observer(() => {
  const [collapsed, setCollapsed] = useState(true);
  const main = useRouteMatch();
  const about = useRouteMatch('/about-us');
  const { theme } = useMst();

  const user = !!localStorage?.yd_address || false;
  const admin = !!localStorage?.yd_token || false;

  const addClass = () => {
    let result;
    if (main.isExact) {
      result = `page-wrapper page-wrapper--home`;
    } else if (about) {
      result = `page-wrapper page-wrapper--about`;
    } else result = `page-wrapper`;
    return result;
  };

  const onCollapsedChange = (value: boolean) => {
    setCollapsed(value);
  };

  return (
    <div className={theme.value}>
      <div className={addClass()}>
        <Header collapsed={collapsed} onCollapsedChange={onCollapsedChange} />
        <div className={`${collapsed ? '' : 'expandWrapper'}`}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            {/* <Route exact path="/auth">
          <Auth />
        </Route> */}
            <GuardedRoute exact path="/index/:indexId" component={Index} auth={user} />
            <GuardedRoute exact path="/ydrtoken" component={YdrToken} auth={user} />
            <GuardedRoute exact path="/admin" component={Admin} auth={admin} />
            <GuardedRoute exact path="/admin" component={Indexes} auth={admin} />
            <GuardedRoute exact path="/admin/index/:indexId" component={AdminIndex} auth={admin} />
            <GuardedRoute exact path="/staking" component={StakePage} auth={user} />
            <GuardedRoute exact path="/indexes" component={IndexDashboard} auth={user} />
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
      </div>
    </div>
  );
});
