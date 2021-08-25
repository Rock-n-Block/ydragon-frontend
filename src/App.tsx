import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

// import { Indexes } from './components/Admin';
// import { GetInModal, InfoModal, MetamaskErrModal } from './components/Modals';
// import AdminIndex from './pages/AdminIndex';
import { useMst } from './store/store';
import { Footer, GuardedRoute, /* GuardedRoute, */ Header } from './components';
import {
  AboutUs,
  Admin,
  AdminIndex,
  Home,
  Index,
  IndexDashboard,
  // Index,
  // IndexDashboard,
  NoPageFound,
  StakePage,
  YdrToken,
  // StakePage,
  // YdrToken,
} from './pages';

import './styles/index.scss';
import { Indexes } from './components/Admin';
import { GetInModal, InfoModal, MetamaskErrModal } from './components/Modals';

export const App: React.FC = observer(() => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const main = useRouteMatch();
  const about = useRouteMatch('/about-us');
  const { theme } = useMst();
  const [bodyClass, setBodyClass] = useState('');

  const user = !!sessionStorage.getItem('yd_address') || false;
  const admin = !!sessionStorage.getItem('yd_token') || false;

  const addClass = () => {
    let result;
    if (main.isExact) {
      result = `page-wrapper page-wrapper--home`;
    } else if (about) {
      result = `page-wrapper page-wrapper--about`;
    } else result = `page-wrapper`;
    return result;
  };

  useEffect(() => {
    if (bodyClass) {
      if (bodyClass !== theme.value) {
        document.body.classList.remove(bodyClass);
        document.body.classList.add(theme.value);
        setBodyClass(theme.value);
      }
    } else {
      document.body.classList.add(theme.value);
      setBodyClass(theme.value);
    }
  }, [theme.value, bodyClass]);
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
            {/* <GuardedRoute exact path="/index/:indexId" component={Index} auth={user} /> */}
            <Route exact path="/index/:indexId">
              <Index />
            </Route>
            <Route exact path="/ydrtoken">
              <YdrToken />
            </Route>
            <GuardedRoute exact path="/admin" component={Admin} auth={admin} />
            <GuardedRoute exact path="/admin" component={Indexes} auth={admin} />
            <GuardedRoute exact path="/admin/index/:indexId" component={AdminIndex} auth={admin} />
            <GuardedRoute exact path="/staking" component={StakePage} auth={user} />
            {/* <Route exact path="/bridge">
              <Bridge />
            </Route> */}
            <Route exact path="/indexes">
              <IndexDashboard />
            </Route>
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
