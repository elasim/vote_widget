import fs from 'fs';
import path from 'path';
import configure from './configure';
import config from './config';

const debug = require('debug')('API.Server');

const SSL_CERT = fs.readFileSync(path.join(__dirname, config.https.cert));
const SSL_KEY = fs.readFileSync(path.join(__dirname, config.https.key));

const server = configure({
  db: config.db,
  port: config.https.port,
  cert: SSL_CERT,
  key: SSL_KEY
});

server.listen(async err => {
  if (err) {
    debug(1, err);
    return process.exit(1);
  }
  debug('API Server listen on port', config.https.port);
});
