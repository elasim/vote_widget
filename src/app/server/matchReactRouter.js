import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import match from 'react-router/lib/match';
import RouterContext from 'react-router/lib/RouterContext';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import { trigger } from 'redial';
import AppContext from '../containers/AppContext'; 
import Html from './components/Html'; 
import configureStore from '../store';
import routes from '../routes';
import path from 'path';
import fs from 'fs';

const assets = JSON.parse(fs.readFileSync(path.join(__dirname, './assets.json')).toString());

export default function matchReactRouter(req, res, next) {
  const history = createMemoryHistory();
  match({
    routes,
    history,
    location: req.url
  }, (error, redirect, renderProps) => {
    handleRouteMatch(req, res, next, error, redirect, renderProps);
  });

}
function handleRouteMatch(req, res, next, error, redirect, renderProps) {
  if (error) {
    return next(error);
  }
  if (redirect) {
    return res.redirect(302, redirect.pathname + redirect.search);
  }
  if (renderProps) {
    return renderApp(req, res, next, renderProps);
  }
  next();
}

function renderApp(req, res, next, renderProps) {
  const store = configureStore();
  const locals = {
    path: renderProps.location.pathname,
    query: renderProps.location.query,
    params: renderProps.params,
    dispatch: store.dispatch,
  };
  trigger('fetch', renderProps.components, locals)
    .then(() => {
      const doc = {
        title: '',
        description: '',
        content: { __html: '' },
        style: { __html: '' },
        meta: {},
        bundle: assets.bundle.js,
        initialState: store.getState()
      };
      const context = {
        setTitle: value => doc.title = value,
        setMeta: (key, value) => doc.meta[key] = value,
      };
      doc.content.__html = renderToString(
        <Provider store={store}>
          <AppContext context={context}>
            <RouterContext {...renderProps} />
          </AppContext>
        </Provider>
      );
      const html = renderToStaticMarkup(<Html {...doc} />);
      res.status(200).send(`<!doctype html>${html}`);
    })
    .catch(next);
}
