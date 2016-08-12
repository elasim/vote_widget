import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import routes from 'app/routes';
import context from '../context';
import AppContext from 'app/containers/AppContext';

export default function App(props) {
  return (
    <Provider store={props.store}>
      <AppContext context={context}>
        <Router routes={routes} history={browserHistory} />
      </AppContext>
    </Provider>
  );
}

App.propTypes = {
  store: PropTypes.object.isRequired,
};
