import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom';

import { Header } from './components';
import { Home, Auth } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className={ match.isExact ? 'page-wrapper page-wrapper--home' : 'page-wrapper' }>
      <Header />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
      </Switch>
    </div>
  );
};
