import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store';
import 'core-js/fn/array/from';

let initialState;

Array.from(document.getElementsByTagName('script'))
  .forEach(script => {
    if (script.getAttribute('type') === 'app-initial-state') {
      initialState = JSON.parse(script.innerHTML);
    }
  });

const store = configureStore(initialState);

renderApp();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    renderApp();
  });
}

if (process.env.NODE_ENV === 'development') {
  const DevTools = require('./components/DevTools').default;
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
