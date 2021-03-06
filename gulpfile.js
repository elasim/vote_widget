const path = require('path'),
  spawn = require('child_process').spawn,
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  eslint = require('gulp-eslint'),
  sassLint = require('gulp-sass-lint'),
  del = require('del'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  webpackDevServer = require('webpack-dev-server'),
  webpackConfig = require('./webpack/config');

gulp.task('eslint', () => {
  return gulp.src([
    'src/**/*.js',
    'src/**/*.jsx',
    '!node_modules/**',
    '!build/**'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task('sass-lint', () => {
  return gulp.src([
    '**/*.s+(a|c)ss',
    '!node_modules/**',
    '!build/**'
  ])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('dev:client', () => {
  return gulp.src(flatEntry(webpackConfig.dev.client.entry))
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig.dev.client))
    .pipe(gulp.dest(webpackConfig.dev.client.output.path));
});
gulp.task('dev:client-test', () => {
  return gulp.src(['spec/**/*.spec.js'])
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig.dev.clientTest))
    .pipe(gulp.dest(webpackConfig.dev.clientTest.output.path));
});
gulp.task('dev:server', () => {
  return gulp.src(flatEntry(webpackConfig.dev.server.entry))
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig.dev.server))
    .pipe(gulp.dest(webpackConfig.dev.server.output.path));
});

gulp.task('prod:client', () => {
  return gulp.src(flatEntry(webpackConfig.prod.client.entry))
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig.prod.client))
    .pipe(gulp.dest(webpackConfig.prod.client.output.path));
});
gulp.task('prod:server', () => {
  return gulp.src(flatEntry(webpackConfig.prod.server.entry))
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig.prod.server))
    .pipe(gulp.dest(webpackConfig.prod.server.output.path));
});

gulp.task('clean:dev', () => {
  return del([
    webpackConfig.dev.server.output.path,
    webpackConfig.dev.client.output.path
  ]);
});
gulp.task('clean:prod', () => {
  return del([
    webpackConfig.prod.server.output.path,
    webpackConfig.prod.client.output.path
  ]);
});

gulp.task('webpack-dev-server', () => {
  const aggreateTimeout = 300;
  let appServer, apiServer, webpackServer;

  const compiler = webpack(webpackConfig.dev.client);
  compiler.plugin('after-emit', (compilation, callback) => {
    runServer();
    callback();
  });

  initWebpackServer();

  function runServer() {
    if (!appServer && !apiServer) {
      initServer();
    } else {
      appServer.restart(aggreateTimeout);
      apiServer.restart(aggreateTimeout);
    }
  }

  function initServer() {
    webpack(webpackConfig.dev.server).watch({
      aggreateTimeout,
      poll: 1000
    }, (err, stats) => {
      if (err) {
        // eslint-disable-next-line
        return console.error(err);
      }
      if (stats.hasErrors()) {
        const errors = stats.toJson('errors-only').errors;
        for (const error of errors) {
          // eslint-disable-next-line
          console.error(error);
        }
        return;
      }
      // eslint-disable-next-line
      console.log(stats.toString());
      if (!appServer) {
        appServer = createProcess(
          path.join(webpackConfig.dev.server.output.path, './app-server.js'),
          { 'NODE_TLS_REJECT_UNAUTHORIZED': 0 }
        );
      } else {
        appServer.restart(aggreateTimeout);
      }
      if (!apiServer) {
        apiServer = createProcess(
          path.join(webpackConfig.dev.server.output.path, './api-server.js')
        );
      } else {
        apiServer.restart(aggreateTimeout);
      }
    });
  }

  function initWebpackServer() {
    if (!webpackServer) {
      webpackServer = createWepbackServer();
      webpackServer.listen(3000, 'localhost', (err) => {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'listen on port 3000');
      });
    }
  }

  function createWepbackServer() {
    return new webpackDevServer(compiler, {
      proxy: {
        '*': 'http://127.0.0.1:9000'
      },
      publicPath: '/',
      filename: 'bundle.js',
      //contentBase: path.join(__dirname, './webpack/devServer'),
      historyApiFallback: true,
      hot: true,
      noInfo: true,
      quiet: false,
      watchOptions: {
        aggreateTimeout,
        poll: 1000,
      },
      stats: {
        colors: true
      }
    });
  }
});

gulp.task('lint', ['eslint', 'sass-lint']);
gulp.task('clean', ['clean:dev', 'clean:prod']);
gulp.task('dev', ['clean:dev', 'lint', 'dev:client', 'dev:server']);
gulp.task('prod', ['clean:prod', 'lint', 'prod:client', 'prod:server']);
gulp.task('default', ['prod']);

function flatEntry(entry) {
  return Object.keys(entry).reduce((flatten, moduleName) => {
    return flatten.concat(entry[moduleName]);
  }, []);
}

function createProcess(script, env) {
  let child = execute();
  let throttle;

  function execute() {
    const proc = spawn('node', [script], { env });
    
    proc.stdout.on('data', data => process.stdout.write(data));
    proc.stderr.on('data', data => process.stderr.write(data));
    proc.on('exit', () => {
      process.stdout.write(`${script}(${proc.pid}) exit\n`);
    });
    return proc;
  }
  function restart() {
    child.kill('SIGINT');
    child = execute();
  }
  return {
    restart(throttleTimeInMsec) {
      clearTimeout(throttle);
      throttle = setTimeout(restart, throttleTimeInMsec);
    },
    kill() {
      child.kill('SIGINT');
    }
  };
}
