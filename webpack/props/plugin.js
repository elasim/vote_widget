const webpack = require('webpack');

const noErrors         = new webpack.NoErrorsPlugin();
const hotModule        = new webpack.HotModuleReplacementPlugin();
const occurenceOrder   = new webpack.optimize.OccurenceOrderPlugin(true);
const dedupe           = new webpack.optimize.DedupePlugin();
const aggresiveMerge   = new webpack.optimize.AggressiveMergingPlugin();
const uglify           = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
});
const defineEnvDev     = new webpack.DefinePlugin({
  'process.env': {NODE_ENV: JSON.stringify('development')}
});
const defineEnvProd    = new webpack.DefinePlugin({
  'process.env': {NODE_ENV: JSON.stringify('production')}
});
const defineEnvBrowser = new webpack.DefinePlugin({
  'process.env': {BROWSER: true}
});

module.exports = {
  dev: {
    client: [
      defineEnvDev,
      defineEnvBrowser,
      hotModule,
      noErrors
    ],
    server: [
      defineEnvDev,
      noErrors,
    ]
  },
  prod: {
    client: [
      defineEnvProd,
      defineEnvBrowser,
      occurenceOrder,
      dedupe,
      aggresiveMerge,
      uglify
    ],
    server: [
      defineEnvProd,
      occurenceOrder,
      dedupe,
      aggresiveMerge,
      uglify
    ]
  }
};
