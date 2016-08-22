const glob = require('glob'),
  path = require('path');

const CLIENT_ENTRY = {
  bundle: [
    'babel-polyfill',
    'isomorphic-fetch',
    'jquery',
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
    'isomorphic-fetch',
    'app/server'
  ]
};
const CLIENT_TEST_ENTRY = findTestSpecs('../../spec/client');

module.exports = {
  dev: {
    client: injectWebpackHMR(CLIENT_ENTRY),
    clientTest: CLIENT_TEST_ENTRY,
    server: SERVER_ENTRY,
  },
  prod: {
    client: CLIENT_ENTRY,
    server: SERVER_ENTRY
  }
};

function findTestSpecs(from) {
  const pattern = path.join(__dirname, `${from}/**/*.[Ss]pec.js`);
  const files = glob.sync(pattern);
  return Object.assign.apply(Object, files.map(file => {
    const entry = {};
    entry[path.parse(file).name] = [
      'babel-polyfill',
      'isomorphic-fetch',
      file
    ];
    return entry;
  }));
}

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
