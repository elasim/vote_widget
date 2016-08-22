import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import configure from './configure';
import config from '../config';

const debug = require('debug')('APP.Server');

const SSL_CERT = fs.readFileSync(path.join(__dirname, config.https.cert));
const SSL_KEY = fs.readFileSync(path.join(__dirname, config.https.key));

const app = configure();

const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  cert: SSL_CERT,
  key: SSL_KEY
}, app);

httpServer.listen(
  config.http.port || 8080,
  config.http.host || '0.0.0.0',
  makeListenHandler(httpServer)
);
httpsServer.listen(
  config.https.port || 8443,
  config.https.host || '0.0.0.0',
  makeListenHandler(httpsServer)
);

function makeListenHandler(server) {
  return err => {
    if (err) {
      return debug(err);
    }
    const addr = server.address();
    debug('listening on %s:%d', addr.address, addr.port);
  };
}
