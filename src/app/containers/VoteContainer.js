import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import withRouter from 'react-router/lib/withRouter';
import flow from 'lodash/flow';
import VoteComponent from '../components/Vote';
import * as VoteAction from '../actions/vote';


const hooks = {
  fetch: ({ dispatch }) => {
    return dispatch(VoteAction.fetchMovies());
  }
};

function mapStateToProps(state) {
  return {
    items: state.movies,
    username: state.username,
    isFetching: state.isFetching,
    wasVoted: state.wasVoted
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: function (index, value, username) {
      return dispatch(VoteAction.voteMovie(value.id, username));
    }
  };
}

class VoteContainer extends Component {
  static propTypes = {
    ...VoteComponent.propTypes,
    router: PropTypes.object.isRequired
  };
  constructor(...args) {
    super(...args);
    this.onSubmit = ::this.onSubmit;
  }
  componentWillMount() {
    const { router, wasVoted, username } = this.props;
    if (!username) {
      router.push('/');
      return;
    }
    if (wasVoted) {
      router.push('/vote_result');
      return;
    }
  }
  onSubmit(index, value) {
    const { router, username, onSubmit } = this.props;
    const result = onSubmit(index, value, username);
    result.then(() => {
      router.push('/vote_result');
    });
  }
  render() {
    return (
      <VoteComponent {...this.props}
        onSubmit={this.onSubmit}
        disable={this.props.isFetching}
      />
    );
  }
}

export { VoteComponent };
export default flow(
  provideHooks(hooks),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(VoteContainer);
