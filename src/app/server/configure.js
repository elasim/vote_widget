import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import matchReactRouter from './matchReactRouter';
import path from 'path';

const LOG_FORMAT = (process.env.NODE_ENV === 'production') ? 'tiny' : 'dev';
const STATIC_DIR = path.join(__dirname, './public');

export default () => {
  const app = express();
  app.use(morgan(LOG_FORMAT));
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(STATIC_DIR));
  app.use(matchReactRouter);

  return app;
};
