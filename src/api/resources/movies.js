import { Router } from 'express';
import database from '../db';
import validate from './validate';

const debug = require('debug')('API.Movie');
const router = new Router();

const SQL_LIST_MOVIES = `
  SELECT
    id,
    title,
    director_name,
    summary
  FROM
    Movies
  LIMIT ?, ?
`;
const SQL_COUNT_MOVIES = 'SELECT COUNT(*) AS count FROM Movies';
const SQL_VOTE = 'INSERT INTO Users (name, movie_id) values (?, ?)';
const SQL_VOTE_RESULT = `
SELECT
  Movies.title,
  COUNT(Users.movie_id) AS NumberOfVotes
FROM
  Movies LEFT JOIN Users
    ON Movies.id = Users.movie_id
WHERE
  Movies.id=?
GROUP BY
  Movies.id
`;

router.get('/', async (req, res, next) => {
  let limit = req.query.limit ? parseInt(req.query.limit, 10) : 30;
  let offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
  const errors = validate.param({
    limit: {
      value: limit,
      test: value => Number.isInteger(value) && value >= 1 && value <= 100
    },
    offset: {
      value: offset,
      test: value => Number.isInteger(value) && value >= 0
    }
  });
  if (errors.length > 0) {
    return res.status(422).json({
      message: 'Invalid parameter',
      errors
    });
  }
  try {
    const list = await database.query(SQL_LIST_MOVIES, [offset, limit]);
    const count = await database.query(SQL_COUNT_MOVIES);
    res.status(200).json({
      movies: list,
      total: count[0].count,
      offset,
      limit
    });
  } catch (error) {
    debug('ListAll', error);
    next(error);
  }
});

router.put('/:movie/votes', async (req, res, next) => {
  const movie = parseInt(req.params.movie, 10);
  const name = req.body.name;
  const errors = validate.param({
    movie: {
      value: movie,
      test: value => Number.isInteger(movie) && value >= 1
    },
    name: {
      value: name,
      test: value => typeof value === 'string' && value.trim().length >= 2
    }
  });
  if (errors.length > 0) {
    return res.status(422).json({
      message: 'Invalid parameter',
      errors
    });
  }
  try {
    await database.query(SQL_VOTE, [name, movie]);
    const voteResult = await database.query(SQL_VOTE_RESULT, [movie]);
    if (voteResult.length === 0) {
      return res.status(404).json(notFound());
    }
    res.status(200).json({
      title: voteResult[0].title,
      votes: voteResult[0].NumberOfVotes
    });
  } catch (error) {
    if (/a foreign key constraint fails/.test(error.message)) {
      return res.status(404).json(notFound());
    }
    next(error);
  }
});

router.get('/:movie/votes', async (req, res, next) => {
  const movie = parseInt(req.params.movie, 10);
  const errors = validate.param({
    movie: {
      value: movie,
      test: value => Number.isInteger(movie) && value >= 1
    }
  });
  if (errors.length > 0) {
    return res.status(422).json({
      message: 'Invalid parameter',
      errors
    });
  }
  try {
    const voteResult = await database.query(SQL_VOTE_RESULT, [movie]);
    if (voteResult.length === 0) {
      return res.status(404).json(notFound());
    }
    res.status(200).json({
      title: voteResult[0].title,
      votes: voteResult[0].NumberOfVotes
    });
  } catch (error) {
    next(error);
  }
});

function notFound() {
  return {
    message: 'Not Found',
    errors: [{
      field: 'movie',
      code: 'not_exist'
    }]
  };
}

export default router;
