import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router/lib/withRouter';
import { createSelector } from 'reselect';
import { provideHooks } from 'redial';
import flow from 'lodash/flow';
import VoteResultComponent from '../components/VoteResult';
import * as VoteAction from '../actions/vote';

const hooks = {
  fetch: ({ dispatch }) => {
    return dispatch(VoteAction.fetchMovies())
      .then(result => {
        if (result.payload instanceof Array) {
          return Promise.all(result.payload.map(movie => {
            return dispatch(VoteAction.fetchVotes(movie.id));
          }));
        }
      });
  }
};

const sortedItemsSelector = createSelector(
  state => state.movies,
  items => {
    return [...items].sort((lhs, rhs) => lhs.votes < rhs.votes);
  }
);

function mapStateToProps(state) {
  return {
    items: sortedItemsSelector(state)
  };
}

class VoteResultContainer extends Component {
  static propTypes = {
    ...VoteResultComponent.propTypes,
    router: PropTypes.object.isRequired
  };
  render() {
    return (
      <VoteResultComponent {...this.props} />
    );
  }
}

export default flow(
  connect(mapStateToProps),
  provideHooks(hooks),
  withRouter
)(VoteResultContainer);
