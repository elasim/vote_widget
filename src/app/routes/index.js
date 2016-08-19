import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import AppLayout from '../containers/AppLayout';
import HomeContainer from '../containers/HomeContainer';
import VoteContainer from '../containers/VoteContainer';
import VoteResultContainer from '../containers/VoteResultContainer';
import NotFound from '../containers/NotFoundContainer';

export default (
  <Route path="/" component={AppLayout}>
    <IndexRoute component={HomeContainer} />
    <Route path="/vote" component={VoteContainer} />
    <Route path="/vote_result" component={VoteResultContainer} />
    <Route path="*" component={NotFound} />
  </Route>
);
