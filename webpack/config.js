const nodeExternals = require('webpack-node-externals'),
  AssetsPlugin = require('assets-webpack-plugin'),
  mergeWith = require('lodash/mergeWith'),
  common = require('./props/common'),
  entry = require('./props/entry'),
  output = require('./props/output'),
  modules = require('./props/module'),
  plugins = require('./props/plugin');

const externals = [
  nodeExternals({
    whitelist: /bootstrap\.(min\.)?css/
  })
];
const devServer = makeConfigure('dev', 'server', {
  target: 'node',
  debug: true,
  devtool: 'sourcemap',
  externals,
  node: {
    __dirname: false,
    __filename: false
  }
});
const devClient = makeConfigure('dev', 'client', {
  target: 'web',
  debug: true,
  devtool: 'sourcemap',
  plugins: [
    assets(output.dev.server.path)
  ]
});
const devClientTest = makeConfigure('dev', 'clientTest', {
  target: 'node',
  debug: true,
  devtool: 'sourcemap',
  externals,
  node: {
    __dirname: false,
    __filename: false
  }
});

const prodServer = makeConfigure('prod', 'server', {
  target: 'node',
  debug: false,
  externals,
  node: {
    __dirname: false,
    __filename: false
  }
});
const prodClient = makeConfigure('prod', 'client', {
  target: 'web',
  debug: false,
  plugins: [
    assets(output.prod.server.path)
  ]
});

module.exports = {
  dev: {
    server: devServer,
    client: devClient,
    clientTest: devClientTest
  },
  prod: {
    server: prodServer,
    client: prodClient
  }
};

function makeConfigure(config, mod, additionals) {
  return mergeWith(additionals, common, {
    entry: entry[config][mod],
    output: output[config][mod],
    module: modules[config][mod],
    plugins: plugins[config][mod]
  }, (objVal, srcVal) => {
    if (objVal instanceof Array) {
      return objVal.concat(srcVal);
    }
  });
}

function assets(outputPath) {
  return new AssetsPlugin({
    path: outputPath,
    filename: 'assets.json'
  });
}
