import nock from 'nock';
import apiConfig from '../../src/app/config.api';
export const MOVIES = [
  { id: 1, title: 'A', director_name: 'DA', summary: 'SA' },
  { id: 2, title: 'B', director_name: 'DB', summary: 'SB' },
  { id: 3, title: 'C', director_name: 'DC', summary: 'SC' },
];
export const mockFetchMoviesResult = (offset = 0, limit = 3) => ({
  movies: MOVIES.slice(offset, limit),
  count: MOVIES.length,
  offset,
  limit
});
export const mockVoteResult = (id = 1, votes = 1) => {
  const idx = MOVIES.findIndex(movie => movie.id === id);
  if (!~idx) {
    return {
      title: 'Unknown Movie',
      votes: votes
    };
  } else {
    return {
      title: MOVIES[idx].title,
      votes: votes
    };
  }
};
export const mockInvalidParameterError = (field) => {
  const error = {
    message: 'Invalid parameter'
  };
  if (field) {
    error.errors = [
      { field, code: 'invalid' }
    ];
  }
  return error;
};

export function mockFetchMoviesSuccess(offset = 0, limit = 3) {
  nock(apiConfig.url).get('/movies')
    .query({ offset, limit })
    .reply(200, mockFetchMoviesResult(offset, limit));
}
export function mockFetchMoviesFailure() {
  nock(apiConfig.url).get('/movies')
    .query(true)
    .reply(422, mockInvalidParameterError());
}
export function mockFetchVotesSuccess(id = 1, votes = 1) {
  nock(apiConfig.url).get(`/movies/${id}/votes`)
    .reply(200, mockVoteResult(id, votes));
}
export function mockFetchVotesFailure(id = 1) {
  nock(apiConfig.url).get(`/movies/${id}/votes`)
    .reply(422, mockInvalidParameterError('movie'));
}
export function mockVoteResultSuccess(id = 1, votes = 1) {
  nock(apiConfig.url).put(`/movies/${id}/votes`)
    .reply(200, mockVoteResult(id, votes));
}
export function mockVoteResultFailure(id = 1) {
  nock(apiConfig.url).put(`/movies/${id}/votes`)
    .reply(422, mockInvalidParameterError('movie'));
}
export function clean() {
  nock.cleanAll();
}
