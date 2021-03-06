import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

const enhancers = [
  applyMiddleware(
    thunk
  )
];

if (process.env.NODE_ENV === 'development') {
  if (process.env.BROWSER) {
    const DevTools = require('../client/components/DevTools').default;
    enhancers.push(DevTools.instrument());
  }
}

export default function configureStore(initialState) {
  const store = createStore(
    reducer,
    initialState,
    compose(...enhancers)
  );
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}
