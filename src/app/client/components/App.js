import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import match from 'react-router/lib/match';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import { trigger } from 'redial';
import routes from 'app/routes';
import context from '../context';
import AppContext from 'app/containers/AppContext';

export default class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };
  constructor(...args) {
    super(...args);
    this.initSequence = true;
  }
  componentDidMount() {
    browserHistory.listen(location => {
      match({ routes, location }, (err, redirect, renderProps) => {
        const { components } = renderProps;
        const local = {
          path: renderProps.location.pathname,
          query: renderProps.location.query,
          params: renderProps.params,
          dispatch: this.props.store.dispatch
        };
        if (!this.initSequence) {
          trigger('fetch', components, local);
        } else {
          this.initSequence = false;
        }
        trigger('defer', components, local);
      });
    });
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <AppContext context={context}>
          <Router routes={routes} history={browserHistory} />
        </AppContext>
      </Provider>
    );
  }
}
