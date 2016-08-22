/* globals describe, expect, it, afterEach */
import configureMockStore from 'redux-mock-store';
import * as Fixture from './fixture';
import * as VoteAction from '../../src/app/actions/vote';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Given FETCH_MOVIES_REQUEST', () => {
  afterEach(() => Fixture.clean());

  describe('When movie fetching has been succeeded', () => {
    it('should be create FETCH_MOVIES_SUCCESS', (done) => {
      const store = mockStore({});
      const expectActions = [
        { type: VoteAction.FETCH_MOVIES_REQUEST },
        {
          type: VoteAction.FETCH_MOVIES_SUCCESS,
          payload: Fixture.MOVIES
        }
      ];
      Fixture.mockFetchMoviesSuccess();
      store.dispatch(VoteAction.fetchMovies())
        .then(() => {
          expect(store.getActions()).toEqual(expectActions);
          done();
        })
        .catch(done.fail);
    });
  });
  describe('When movie fetching has been failed', () => {
    it('should be create FETCH_MOVIES_FAILURE', (done) => {
      const store = mockStore({});
      const expectActions = [
        { type: VoteAction.FETCH_MOVIES_REQUEST },
        {
          type: VoteAction.FETCH_MOVIES_FAILURE,
          payload: Fixture.mockInvalidParameterError()
        }
      ];
      Fixture.mockFetchMoviesFailure();
      store.dispatch(VoteAction.fetchMovies())
        .then(() => {
          expect(store.getActions()).toEqual(expectActions);
          done();
        })
        .catch(done.fail);
    });
  });
});

describe('Given FETCH_VOTES_REQUEST', () => {
  afterEach(() => Fixture.clean());
  
  describe('When votes fetching has been succeeded', () => {
    describe('And that movie already fetched', () => {
      it('should be create FETCH_VOTES_SUCCESS', (done) => {
        const store = mockStore({
          movies: Fixture.MOVIES
        });
        const movieId = 1;
        const expectActions = [
          { type: VoteAction.FETCH_VOTES_REQUEST },
          {
            type: VoteAction.FETCH_VOTES_SUCCESS,
            payload: {
              id: movieId,
              result: Fixture.mockVoteResult(movieId)
            }
          }
        ];
        Fixture.mockFetchVotesSuccess(movieId);
        store.dispatch(VoteAction.fetchVotes(movieId))
          .then(() => {
            expect(store.getActions()).toEqual(expectActions);
            done();
          })
          .catch(done.fail);
      });
    });
    describe('And that movie never been fetched before', () => {
      it('should be create FETCH_VOTES_FAILURE with error',
        (done) => {
          const store = mockStore({
            movies: Fixture.MOVIES
          });
          const movieId = Fixture.MOVIES.length + 1;
          const expectActions = [
            { type: VoteAction.FETCH_VOTES_REQUEST },
            {
              type: VoteAction.FETCH_VOTES_FAILURE,
              payload: Fixture.mockInvalidParameterError('movie')
            }
          ];
          Fixture.mockFetchVotesSuccess(movieId);
          store.dispatch(VoteAction.fetchVotes(movieId))
            .then(() => {
              expect(store.getActions()).toEqual(expectActions);
              done();
            })
            .catch(done.fail);
        }
      );
    });
  });
  describe('When movie ID is not exist', () => {
    it('should be create FETCH_VOTES_FAILURE', (done) => {
      const store = mockStore();
      const movieId = 1;
      const expectActions = [
        { type: VoteAction.FETCH_VOTES_REQUEST },
        {
          type: VoteAction.FETCH_VOTES_FAILURE,
          payload: Fixture.mockInvalidParameterError('movie')
        }
      ];
      Fixture.mockFetchVotesFailure(movieId);
      store.dispatch(VoteAction.fetchVotes(movieId))
        .then(() => {
          expect(store.getActions()).toEqual(expectActions);
          done();
        })
        .catch(done.fail);
    });
  });
});

describe('Given VOTE_MOVIE_REQUEST', () => {
  afterEach(() => Fixture.clean());
  
  describe('When voting has been succeeded', () => {
    describe('And that movie already fetched', () => {
      it('should be create VOTE_MOVIE_SUCCESS', (done) => {
        const store = mockStore({
          movies: Fixture.MOVIES
        });
        const movieId = 1;
        const expectActions = [
          { type: VoteAction.VOTE_MOVIE_REQUEST },
          { type: VoteAction.VOTE_MOVIE_SUCCESS }
        ];
        Fixture.mockVoteResultSuccess(movieId);
        store.dispatch(VoteAction.voteMovie(movieId, 'name'))
          .then(() => {
            expect(store.getActions()).toEqual(expectActions);
            done();
          })
          .catch(done.fail);
      });
    });
    describe('And that movie never been fetched before', () => {
      it('should be create VOTE_MOVIE_FAILURE with error message',
        (done) => {
          const store = mockStore({
            movies: Fixture.MOVIES
          });
          const movieId = Fixture.MOVIES.length + 1;
          const expectActions = [
            { type: VoteAction.VOTE_MOVIE_REQUEST },
            {
              type: VoteAction.VOTE_MOVIE_FAILURE,
              payload: Fixture.mockInvalidParameterError('movie')
            }
          ];
          Fixture.mockVoteResultSuccess(movieId);
          store.dispatch(VoteAction.voteMovie(movieId, 'name'))
            .then(() => {
              expect(store.getActions()).toEqual(expectActions);
              done();
            })
            .catch(done.fail);
        }
      );
    });
  });
  describe('When movie ID is not exist', () => {
    it('should be create VOTE_MOVIE_FAILURE', (done) => {
      const store = mockStore();
      const movieId = 1;
      const expectActions = [
        { type: VoteAction.VOTE_MOVIE_REQUEST },
        {
          type: VoteAction.VOTE_MOVIE_FAILURE,
          payload: Fixture.mockInvalidParameterError('movie')
        }
      ];
      Fixture.mockVoteResultFailure(movieId);
      store.dispatch(VoteAction.voteMovie(movieId, 'name'))
        .then(() => {
          expect(store.getActions()).toEqual(expectActions);
          done();
        })
        .catch(done.fail);
    });
  });
});
