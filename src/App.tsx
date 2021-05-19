import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Header } from './components';
import { Home, Auth } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <div id="app">
      <Router>
        <Header />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
