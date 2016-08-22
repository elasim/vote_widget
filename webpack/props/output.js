const path = require('path');

const OUTPUT_ROOT = path.join(__dirname, '../../build');

module.exports = {
  dev: {
    client: {
      path: path.join(OUTPUT_ROOT, './dev/public'),
      filename: '[name].js'
    },
    server: {
      path: path.join(OUTPUT_ROOT, './dev'),
      filename: '[name]-server.js'
    },
    clientTest: {
      path: path.join(OUTPUT_ROOT, './spec'),
      filename: '[name].js'
    }
  },
  prod: {
    client: {
      path: path.join(OUTPUT_ROOT, './prod/public'),
      filename: '[name].js'
    },
    server: {
      path: path.join(OUTPUT_ROOT, './prod'),
      filename: '[name]-server.js'
    }
  }
};
