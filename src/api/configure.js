import https from 'https';
import express from 'express';
import accepts from 'accepts';
import bodyParser from 'body-parser';
import cors from 'cors';
import enforcesSSL from 'express-enforces-ssl';
import contentLength from 'express-content-length-validator';
import helmet from 'helmet';
import morgan from 'morgan';
import database from './db';
import resources from './resources';

export default function configure({ db, host, port, cert, key }) {
  const debug = require('debug')('API.Server');
  const api = express();

  database.configure(db)
    .catch(error => {
      debug('DB Configure failure', error);
      process.exit(1);
    });

  api.enable('trust proxy');

  api.use(morgan('combined'));
  api.use(enforcesSSL());
  api.use(contentLength.validateMax({ max: 4096 }));
  api.use(helmet.noCache());
  api.use(helmet.hidePoweredBy());
  api.use(helmet.dnsPrefetchControl());
  api.use(helmet.ieNoOpen());
  api.use(helmet.hsts());
  api.use(helmet.hpkp({
    maxAge: 60 * 60 * 24 * 90,
    sha256s: ['key-1', 'key-2']
  }));
  api.use(helmet.noSniff());
  api.use(helmet.noCache());
  api.use(cors());
  api.use(bodyParser.json());

  api.use(versionCheck({
    'application/vnd.votewidget.v1+json': resources,
    'default': resources
  }));
  api.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });
  // eslint-disable-next-line no-unused-vars
  api.use((error, req, res, next) => {
    debug('Uncaught Exception', error);
    res.status(500).json({
      message: 'internal server error'
    });
  });

  const server = https.createServer({ key, cert }, api);
  
  return {
    listen(handler) {
      server.listen(port, host, handler);
    },
    async close() {
      server.close();
      await database.close();
    }
  };
}

function versionCheck(rules) {
  return (req, res, next) => {
    const version = accepts(req).type([
      'application/vnd.votewidget.v1+json'
    ]);
    if (rules[version]) {
      rules[version](req, res, next);
    } else if(rules.default) {
      rules.default(req, res, next);
    } else {
      next();
    }
  };
}
