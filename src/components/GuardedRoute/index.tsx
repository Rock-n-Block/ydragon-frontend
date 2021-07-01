import React from 'react';
import { Route, Redirect } from 'react-router-dom';


interface GuardedRouteProps {
  exact: boolean;
  path: string;
  component: React.FC<{}>;
  auth: boolean;
}

const GuardedRoute: React.FC<GuardedRouteProps> = (props) => {
  const {auth, ...otherProps} = props
  return auth ? <Route {...otherProps} /> : <Redirect to="/" />;
};

export default GuardedRoute;
