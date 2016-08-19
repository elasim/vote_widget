
const babel = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel'
};
const babelHMR = Object.assign({}, babel, {
  loader: 'react-hot!babel'
});
const file = {
  test: /\.(jpg|png|gif)$/,
  loader: 'url?limit=102400'
};
const css = {
  test: /\.css$/,
  exclude: /node_modules/,
  loaders: [
    'style',
    cssLoader({
      modules: true,
      sourceMaps: true,
      loaders: true,
      localIdentName: '[local]__[hash:4]'
    })
  ]
};
const cssLocal = Object.assign({}, css, {
  loaders: [
    cssLoader({
      locals: true,
      modules: true,
      sourceMaps: true,
      loaders: true,
      localIdentName: '[local]__[hash:4]'
    })
  ]
});
const sass = {
  test: /\.sass$/,
  exclude: /node_modules/,
  loaders: [
    'style',
    cssLoader({
      modules: true,
      sourceMaps: true,
      loaders: true,
      localIdentName: '[local]__[hash:4]'
    }),
    'sass'
  ]
};
const sassLocal = Object.assign({}, sass, {
  loaders: [
    cssLoader({
      locals: true,
      modules: true,
      sourceMaps: true,
      loaders: true,
      localIdentName: '[local]__[hash:4]'
    }),
    'sass'
  ]
});
const json = {
  test: /\.json$/,
  exclude: /node_modules/,
  loader: 'json'
};

module.exports = {
  dev: {
    client: {
      loaders: useBootstrap([
        babelHMR,
        sass,
        css,
        file,
        json
      ])
    },
    server: {
      loaders: ignoreBootstrap([
        babel,
        sassLocal,
        cssLocal,
        json
      ])
    },
    clientTest: {
      loaders: ignoreBootstrap([
        babel,
        sassLocal,
        cssLocal,
        json
      ])
    }
  },
  prod: {
    client: {
      loaders: useBootstrap([
        babel,
        sass,
        css,
        file,
        json
      ])
    },
    server: {
      loaders: ignoreBootstrap([
        babel,
        sassLocal,
        cssLocal,
        json
      ])
    }
  }
};

function cssLoader(opt) {
  opt = opt || {
    locals: false,
    modules: true,
    sourceMap: true,
    loaders: true,
    localIdentName: '[local]_[hash:4]'
  };
  const loader = opt.locals ? 'css-loader/locals' : 'css';
  return loader + '?' + [
    opt.modules ? 'modules' : '',
    opt.sourceMap ? 'sourceMaps' : '',
    opt.loaders ? 'importLoaders=1' : '',
    opt.localIdentName ? 'localIdentName=' + opt.localIdentName : ''
  ].join('&');
}

function useBootstrap(loaders) {
  return [].concat(loaders, [
    {
      test: /bootstrap\.(?:min\.)?css$/,
      loader: 'style!css'
    },
    {
      test: /bootstrap\/js\//,
      loader: 'imports?jQuery=jquery'
    },
    {
      test: /\.(woff|woff2)$/,
      loader: 'url?limit=10000&minetype=application/font-woff'
    },
    {
      test: /\.ttf$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream'
    },
    {
      test: /\.eot$/,
      loader: 'file'
    },
    {
      test: /\.svg$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml'
    }
  ]);
}

function ignoreBootstrap(loaders) {
  return [].concat(loaders, {
    test: /bootstrap(.+)\.css$/,
    loader: 'ignore'
  });
}
