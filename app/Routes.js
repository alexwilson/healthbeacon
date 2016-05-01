import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './App';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFoundPage from './pages/NotFoundPage';
import requireAuth from './utils/requireAuth';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="dashboard" component={DashboardPage} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
