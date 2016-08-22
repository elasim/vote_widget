import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import AppLayout from 'app/containers/AppLayout';
import VoteComponent from 'app/components/Vote';
import VoteResultComponent from 'app/components/VoteResult';

export default (
  <Route path="/" component={AppLayout}>
    <IndexRoute component={VoteComponent} />
    <Route path="/vote" component={VoteComponent}/>
    <Route path="/vote_result" component={VoteResultComponent} />
  </Route>
);
