import { handleActions } from 'redux-actions';
import update from 'react/lib/update';
import * as VoteAction from '../actions/vote';

const initialState = {
  movies: null,
  username: null,
  error: null,
  isFetching: false,
  wasVoted: false
};

export default handleActions({
  [VoteAction.SET_USERNAME]: updateUsername,
  [VoteAction.FETCH_MOVIES_REQUEST]: setFetchingState,
  [VoteAction.FETCH_MOVIES_SUCCESS]: updateMovieList,
  [VoteAction.FETCH_MOVIES_FAILURE]: error,
  [VoteAction.VOTE_MOVIE_REQUEST]: setFetchingState,
  [VoteAction.VOTE_MOVIE_SUCCESS]: setVotedState,
  [VoteAction.VOTE_MOVIE_FAILURE]: error,
  [VoteAction.FETCH_VOTES_REQUEST]: setFetchingState,
  [VoteAction.FETCH_VOTES_SUCCESS]: updateVotes,
  [VoteAction.FETCH_VOTES_FAILURE]: error,
  [VoteAction.CLEAR_ERROR]: clearError
}, initialState);

function setFetchingState(state) {
  return { ...state, isFetching: true };
}
function setVotedState(state) {
  return {
    ...state,
    wasVoted: { $set: true }
  };
}
function updateUsername(state, { payload }) {
  return { ...state, username: payload };
}
function updateMovieList(state, { payload }) {
  const movies = payload.map(movie => {
    return {
      id: movie.id,
      title: movie.title,
      directorName: movie.director_name,
      summary: movie.summary,
      votes: null
    };
  });
  return {
    ...state,
    movies,
    isFetching: false,
  };
}
function updateVotes(state, { payload }) {
  const movieIdx = state.movies.findIndex(movie => movie.id === payload.id);
  return update(state, {
    movies: {
      [movieIdx]: {
        votes: { $set: payload.result.votes }
      }
    },
    isFetching: { $set: false }
  });
}
function error(state, { payload }) {
  return { ...state, error: payload, isFetching: false };
}
function clearError(state) {
  return { ...state, error: null };
}
