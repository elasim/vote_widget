/* globals describe, expect, it */
import * as Fixture from './fixture';
import * as VoteAction from '../../src/app/actions/vote';
import reducer from '../../src/app/reducers/vote';

describe('Given Reducer', () => {

  it('should return initial state', () => {
    const nextState = reducer(undefined, {});
    expect(nextState).toEqual({
      movies: null,
      username: null,
      error: null,
      isFetching: false,
      wasVoted: false
    });
  });

  describe('When unknown action was dispatched', () => {
    it('should return current state', () => {
      const nextState = reducer({ current: 1 }, { type: 'unknown '});
      expect(nextState.current).toEqual(1);
    });
  });

  describe('When SET_USERNAME was dispatched', () => {
    it('should change username', () => {
      const newUsername = 'newuser';
      const nextState = reducer(undefined, {
        type: VoteAction.SET_USERNAME,
        payload: newUsername
      });
      expect(nextState.username).toBe(newUsername);
    });
  });

  describe('When FETCH_MOVIE_REQUEST was dispatched', () => {
    it('should toggle fetching state', () => {
      const nextState = reducer(undefined, {
        type: VoteAction.FETCH_MOVIES_REQUEST
      });
      expect(nextState.isFetching).toBe(true);
    });
  });

  describe('When FETCH_MOVIE_SUCCESS was dispatched', () => {
    it('should toggle fetching state and update the movie list', () => {
      const state = {};
      const payload = Fixture.MOVIES;
      const expectedMovieList = payload.map(movie => ({
        id: movie.id,
        title: movie.title,
        directorName: movie.director_name,
        summary: movie.summary,
        votes: null
      }));
      const nextState = reducer(state, {
        type: VoteAction.FETCH_MOVIES_SUCCESS,
        payload
      });
      expect(nextState.isFetching).toBe(false);
      expect(nextState.movies).toEqual(expectedMovieList);
    });
  });

  describe('When FETCH_MOVIE_FAILURE was dispatched', () => {
    it('should toggle fetching state and update the error', () => {
      const state = { error: 'old error' };
      const expectedNewError = {
        message: 'Some New Error'
      };
      const nextState = reducer(state, {
        type: VoteAction.FETCH_MOVIES_FAILURE,
        payload: expectedNewError
      });
      expect(nextState.isFetching).toBe(false);
      expect(nextState.error).toEqual(expectedNewError);
    });
  });

  describe('When FETCH_VOTES_REQUEST was dispatched', () => {
    it('should toggle fetching state', () => {
      const nextState = reducer(undefined, {
        type: VoteAction.FETCH_VOTES_REQUEST,
      });
      expect(nextState.isFetching).toBe(true);
    });
  });

  describe('When FETCH_VOTES_SUCCESS was dispatched', () => {
    it('should toggle fetching state and update vote results', () => {
      const state = {
        movies: [{ ...Fixture.MOVIES[0], votes: null }]
      };
      const nextState = reducer(state, {
        type: VoteAction.FETCH_VOTES_SUCCESS,
        payload: {
          id: 1,
          result: Fixture.mockVoteResult(1)
        }
      });
      expect(nextState.isFetching).toBe(false);
      expect(nextState.movies[0].votes).toBe(1);
    });
  });

  describe('When FETCH_VOTES_FAILURE was dispatched', () => {
    it('should toggle fetching state and update the error', () => {
      const expectedNewError = {
        message: 'some error'
      };
      const nextState = reducer(undefined, {
        type: VoteAction.FETCH_VOTES_FAILURE,
        payload: expectedNewError
      });
      expect(nextState.isFetching).toBe(false);
      expect(nextState.error).toEqual(expectedNewError);
    });
  });

});
