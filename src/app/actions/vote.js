import request from '../lib/request';
import apiConfig from '../config.api';

// setUsername()
export const SET_USERNAME = Symbol('Username.Set');

// clearError()
export const CLEAR_ERROR = Symbol('Clear.Error');

// fetchMovies()
export const FETCH_MOVIES_REQUEST = Symbol('Fetch.Movies.Request');
export const FETCH_MOVIES_SUCCESS = Symbol('Fetch.Movies.Success');
export const FETCH_MOVIES_FAILURE = Symbol('Fetch.Movies.Failure');

// fetchVotes(id)
export const FETCH_VOTES_REQUEST = Symbol('Fetch.Votes.Request');
export const FETCH_VOTES_SUCCESS = Symbol('Fetch.Votes.Success');
export const FETCH_VOTES_FAILURE = Symbol('Fetch.Votes.Failure');

// voteMovie(id, name)
export const VOTE_MOVIE_REQUEST = Symbol('Vote.Movie.Request');
export const VOTE_MOVIE_SUCCESS = Symbol('Vote.Movie.Success');
export const VOTE_MOVIE_FAILURE = Symbol('Vote.Movie.Failure');

export function setUsername(username) {
  return {
    type: SET_USERNAME,
    payload: username
  };
}

export function clearError() {
  return {
    type: CLEAR_ERROR
  };
}

export function fetchMovies() {
  return dispatch => {
    dispatch({ type: FETCH_MOVIES_REQUEST });
    return request(`${apiConfig.url}/movies?offset=0&limit=3`)
      .then(result => dispatch({
        type: FETCH_MOVIES_SUCCESS,
        payload: result.movies
      }))
      .catch(e => dispatch({
        type: FETCH_MOVIES_FAILURE,
        payload: e
      }));
  };
}

export function fetchVotes(id) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_VOTES_REQUEST });
    return request(`${apiConfig.url}/movies/${id}/votes`)
      .then(result => checkUnknownMovie(id, result, getState))
      .then(result => {
        dispatch({
          type: FETCH_VOTES_SUCCESS,
          payload: { id, result }
        });
      })
      .catch(e => dispatch({
        type: FETCH_VOTES_FAILURE,
        payload: e
      }));
  };
}

export function voteMovie(id, name) {
  return (dispatch, getState) => {
    dispatch({ type: VOTE_MOVIE_REQUEST });
    return request(`${apiConfig.url}/movies/${id}/votes`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify({ name })
    })
      .then(result => checkUnknownMovie(id, result, getState))
      .then(() => {
        return dispatch({
          type: VOTE_MOVIE_SUCCESS
        });
      })
      .catch(e => dispatch({
        type: VOTE_MOVIE_FAILURE,
        payload: e
      }));
  };
}

function checkUnknownMovie(id, result, getState) {
  const idx = getState().movies.findIndex(movie => movie.id === id);
  if (!~idx) {
    throw {
      message: 'Invalid parameter',
      errors: [{
        field: 'movie',
        code: 'invalid'
      }]
    };
  }
  return result;
}
