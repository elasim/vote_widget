const CLIENT_ENTRY = {
  bundle: [
    'babel-polyfill',
    'app/client'
  ]
};
const SERVER_ENTRY = {
  api: [
    'babel-polyfill',
    'api/server'
  ],
  app: [
    'babel-polyfill',
    'app/server'
  ]
};

module.exports = {
  dev: {
    client: injectWebpackHMR(CLIENT_ENTRY),
    server: SERVER_ENTRY
  },
  prod: {
    client: CLIENT_ENTRY,
    server: SERVER_ENTRY
  }
};

function injectWebpackHMR(entrySet) {
  const newEntrySet = {};
  for (const moduleName in entrySet) {
    newEntrySet[moduleName] = [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server'
    ].concat(entrySet[moduleName]);
  }
  return newEntrySet;
}
