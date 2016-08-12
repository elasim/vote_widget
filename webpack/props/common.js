const path = require('path');
const SOURCE_DIR = path.join(__dirname, '../../src');

module.exports = {
  context: SOURCE_DIR,
  resolve: {
    root: SOURCE_DIR,
    extensions: ['', '.js', '.jsx', '.json']
  },
  cache: true,
};
