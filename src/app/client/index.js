import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store';
import 'core-js/fn/array/from';

const store = configureStore();

renderApp();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    renderApp();
  });
}

if (process.env.NODE_ENV === 'development') {
  const DevTools = require('../containers/DevTools').default;
  const debugLayer = document.createElement('div');
  document.body.appendChild(debugLayer);

  render(
    <Provider store={store}>
      <DevTools/>
    </Provider>,
    debugLayer
  );
}

function renderApp() {
  const App = require('./components/App').default;
  render(<App store={store}/>, document.getElementById('app'));
}
