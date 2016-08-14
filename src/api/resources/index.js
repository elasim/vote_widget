import { Router } from 'express';
import routeMovies from './movies';
// This implementation is specification of API verion 1
//---------------------------------------------------------
const debug = require('debug')('API.v1');
const router = new Router();

router.use((req, res, next) => {
  res.set('Accepted-Version', '1');
  next();
});
router.use('/movies', routeMovies);

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
  debug(error);
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      message: error.message
    });
  } else {
    res.status(500).json({
      message: 'internal server error'
    });
  }
});

export default router;
