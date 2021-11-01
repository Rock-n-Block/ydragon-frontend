import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { GuardedRoute, Loader } from '../../components';
import { Indexes } from '../../components/Admin';
import { useMst } from '../../store/store';

const AboutUs = React.lazy(() => import('../../pages/AboutUs/index'));
const PbfPage = React.lazy(() => import('../../pages/PbfPage/index'));
const Simplified = React.lazy(() => import('../../pages/Simplified/index'));
const StakingPage = React.lazy(() => import('../../pages/StakingPage/index'));
const YdrToken = React.lazy(() => import('../../pages/YdrToken/index'));
const Admin = React.lazy(() => import('../../pages/Admin/index'));
const AdminIndex = React.lazy(() => import('../../pages/AdminIndex/index'));
const Home = React.lazy(() => import('../../pages/HomeDark/index'));
const Index = React.lazy(() => import('../../pages/IndexPage/index'));
const IndexDashboard = React.lazy(() => import('../../pages/IndexDashboard/index'));
const NoPageFound = React.lazy(() => import('../../pages/NoPageFound/index'));

const Routes: React.FC = observer(() => {
  const { networks } = useMst();

  const user = !!localStorage.getItem('yd_address') || false;
  const admin = !!localStorage.getItem('yd_token') || false;
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
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
    </Suspense>
  );
});
export default Routes;
