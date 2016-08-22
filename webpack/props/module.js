
const babel = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel'
};
const babelHMR = Object.assign({}, babel, {
  loader: 'react-hot!babel'
});
const file = {
  test: /\.jpg$/,
  loader: 'file'
};
const url = {
  test: /\.(png|gif)/,
  loader: 'url?limit=102400' // limit unit: byte
};
const css = {
  test: /\.css$/,
  loaders: [
    'style',
    cssLoader({
      modules: true,
      sourceMaps: true,
      loaders: true,
      localIdentName: '[local]__[hash:4]'
    }),
  ]
};
const cssLocal = Object.assign({}, css, {
  loader: [
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

module.exports = {
  dev: {
    client: {
      loaders: [babelHMR, sass, css, file, url]
    },
    server: {
      loaders: [babel, sassLocal, cssLocal]
    }
  },
  prod: {
    client: {
      loaders: [babel, sass, css, file, url],
    },
    server: {
      loaders: [babel, sassLocal, cssLocal]
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
  return loader + [
    opt.modules ? 'modules' : '',
    opt.sourceMap ? 'sourceMaps': '',
    opt.loaders ? 'importLoaders=1' : '',
    opt.localIdentName ? 'localIdentName=' + opt.localIdentName : '',
  ].join('&');
}
