import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router/lib/withRouter';
import flow from 'lodash/flow';
import UsernamePrompt from '../components/UsernamePrompt';
import { setUsername } from '../actions/vote';

function mapStateToProps(state) {
  return {
    username: state.username
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setUsername: (username) => dispatch(setUsername(username))
  };
}

class HomeContainer extends Component {
  static propTypes = {
    ...UsernamePrompt.propTypes,
    username: PropTypes.string,
    router: PropTypes.object.isRequired
  }
  constructor(...args) {
    super(...args);
    this.setUsername = ::this.setUsername;
  }
  componentWillMount() {
    const { router, username } = this.props;
    if (username) {
      router.push('/vote');
    }
  }
  render() {
    return <UsernamePrompt {...this.props} setUsername={this.setUsername} />;
  }
  setUsername(username) {
    const { router, setUsername } = this.props;
    setUsername(username);
    router.push('/vote');
  }
}

export default flow(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(HomeContainer);
