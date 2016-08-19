/* globals describe, it, expect, beforeEach, beforeAll, afterAll */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.DEBUG = 'API.*';

const fs = require('fs'),
  path = require('path'),
  request = require('request'),
  configure = require('../../src/api/configure').default,
  database = require('./db.fixture');

const PORT = 3000;
const BASE = `https://127.0.0.1:${PORT}`;
const DB_CONNECTION_INFO = {
  host: 'localhost',
  user: 'root',
  password: 'semaphoredb',
  database: 'test_db'
};
const SSL_CERT = fs.readFileSync(path.join(__dirname, '../support/test.crt'));
const SSL_KEY = fs.readFileSync(path.join(__dirname, '../support/test.key'));

describe('API Spec', () => {
  let server, dbConn;

  beforeAll(done => {
    database.prepare(DB_CONNECTION_INFO)
      .then(dbConn_ => {
        dbConn = dbConn_;
        server = configure({
          db: DB_CONNECTION_INFO,
          port: PORT,
          cert: SSL_CERT,
          key: SSL_KEY
        });
        server.listen(err => err ? done.fail(err) : done());
      }, done.fail);
  });

  afterAll(done => {
    if (dbConn) {
      database.reset(dbConn)
        .then(() => done(), done.fail);
    }
  });

  beforeEach(done => {
    database.reset(dbConn).then(done, done.fail);
  });

  describe('When requested version is not available', () => {
    it('should use latest version of API by default', (done) => {
      return request.get({
        url: BASE,
        headers: {
          'accept': 'application/vnd.votewidget.v2+json'
        }
      }, (error, response, body) => {
        if (error) {
          return done.fail(error);
        }
        expect(response.headers['accepted-version']).toBe('1');
        expect(response.statusCode).toBe(404);
        try {
          const result = JSON.parse(body);
          expect(result.message).toMatch(/Not Found/);
        } catch (e) {
          return done.fail(e);
        }
        done();
      });
    });
  });

  describe('When request without specific version', () => {
    it('should use latest version of API by default', (done) => {
      return request.get(BASE, (error, response, body) => {
        if (error) {
          return done.fail(error);
        }
        expect(response.headers['accepted-version']).toBe('1');
        expect(response.statusCode).toBe(404);
        try {
          const result = JSON.parse(body);
          expect(result.message).toMatch(/Not Found/);
        } catch (e) {
          return done.fail(e);
        }
        done();
      });
    });
  });

  describe('GET /movies', () => {
    beforeEach(done => {
      database.createDummy(dbConn).then(done, done.fail);
    });

    it('should be return 30 items without parameter', (done) => {
      request.get(`${BASE}/movies`, (err, res, body) => {
        if (err) {
          return done.fail(err);
        }
        try {
          const result = JSON.parse(body);
          expect(result.offset).toBe(0);
          expect(result.limit).toBe(30);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('should be return total number of stored movie informations', (done) => {
      request.get(`${BASE}/movies`, (err, res, body) => {
        if (err) {
          return done.fail(err);
        }
        try {
          const result = JSON.parse(body);
          expect(typeof result.total).toBe('number');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('should be return movies with id, title, director_name and summary',
      (done) => request.get(`${BASE}/movies`, (err, res, body) => {
        if (err) {
          return done.fail(err);
        }
        try {
          const result = JSON.parse(body);
          expect(result.movies instanceof Array).toBe(true);
          for (const movie of result.movies) {
            expect(typeof movie.id).toBe('number');
            expect(typeof movie.title).toBe('string');
            expect(typeof movie.director_name).toBe('string');
            expect(typeof movie.summary).toBe('string');
          }
          done();
        } catch (error) {
          done.fail(error);
        }
      })
    );

    describe('When offset is less than 0', () => {
      it('should be return invalid parameter error with message', (done) => {
        request.get(`${BASE}/movies?offset=-1`, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(422);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Invalid parameter/);
            expect(result.errors[0].field).toBe('offset');
            expect(result.errors[0].code).toBe('invalid');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

    describe('When limit is greater than 100', () => {
      it('should be return invalid parameter error with message', (done) => {
        request.get(`${BASE}/movies?limit=101`, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(422);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Invalid parameter/);
            expect(result.errors[0].field).toBe('limit');
            expect(result.errors[0].code).toBe('invalid');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

    describe('When limit is less than 1', () => {
      it('should be return invalid parameter error with message', (done) => {
        request.get(`${BASE}/movies?limit=0`, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(422);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Invalid parameter/);
            expect(result.errors[0].field).toBe('limit');
            expect(result.errors[0].code).toBe('invalid');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

  });

  describe('GET /movies/:movie/votes', () => {
    beforeEach(done => {
      database.createDummy(dbConn).then(done, done.fail);
    });

    it('should be return vote result', (done) => {
      request.get(`${BASE}/movies/1/votes`, (err, res, body) => {
        if (err) {
          return done.fail(err);
        }
        try {
          const result = JSON.parse(body);
          expect(typeof result.title).toBe('string');
          expect(typeof result.votes).toBe('number');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    describe('When :movie is less than 0', () => {
      it('should be return invalid parameter error with message', (done) => {
        request.get(`${BASE}/movies/0/votes`, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(422);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Invalid parameter/);
            expect(result.errors[0].field).toBe('movie');
            expect(result.errors[0].code).toBe('invalid');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

    describe('When requested movie is not exist', () => {
      it('should be return not exist error with message', (done) => {
        request.get(`${BASE}/movies/4/votes`, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(404);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Not Found/);
            expect(result.errors[0].field).toBe('movie');
            expect(result.errors[0].code).toBe('not_exist');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

  });

  describe('PUT /movies/:movie/votes', () => {
    beforeEach(done => {
      database.createDummy(dbConn).then(done, done.fail);
    });

    it('should be return vote result', (done) => {
      request.put({
        url: `${BASE}/movies/1/votes`,
        body: JSON.stringify({ 'name': 'TestName' }),
        headers: { 'Content-Type': 'application/json' }
      }, (err, res, body) => {
        if (err) {
          return done.fail(err);
        }
        try {
          const result = JSON.parse(body);
          expect(typeof result.title).toBe('string');
          expect(typeof result.votes).toBe('number');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('should be increase a vote', (done) => {
      request.get(`${BASE}/movies/1/votes`, (err, res, body) => {
        if (err) {
          return done.fail(err);
        }
        expect(res.statusCode).toBe(200);
        const before = JSON.parse(body);

        request.put({
          url: `${BASE}/movies/1/votes`,
          body: JSON.stringify({ 'name': 'TestName' }),
          headers: { 'Content-Type': 'application/json' }
        }, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          try {
            const result = JSON.parse(body);
            expect(result.title).toBe(before.title);
            expect(result.votes).toBe(before.votes + 1);
            expect(typeof result.title).toBe('string');
            expect(typeof result.votes).toBe('number');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

    describe('When name is not given', () => {
      it('should be return missing field error with message', (done) => {
        request.put(`${BASE}/movies/1/votes`, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          try {
            expect(res.statusCode).toBe(422);
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Invalid parameter/);
            expect(result.errors[0].field).toBe('name');
            expect(result.errors[0].code).toBe('missing_field');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

    describe('When name is less than two characters', () => {
      it('should be return invalid parameter error with message', (done) => {
        request.put({
          url: `${BASE}/movies/1/votes`,
          body: JSON.stringify({ 'name': 'a' }),
          headers: { 'Content-Type': 'application/json' }
        }, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(422);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Invalid parameter/);
            expect(result.errors[0].field).toBe('name');
            expect(result.errors[0].code).toBe('invalid');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

    describe('When :movie is less than 0', () => {
      it('should be return invalid parameter error with message', (done) => {
        request.put({
          url: `${BASE}/movies/0/votes`,
          body: JSON.stringify({ 'name': 'TestName' }),
          headers: { 'Content-Type': 'application/json' }
        }, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(422);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Invalid parameter/);
            expect(result.errors[0].field).toBe('movie');
            expect(result.errors[0].code).toBe('invalid');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

    describe('When requested movie is not exist', () => {
      it('should be return not exist error with message', (done) => {
        request.put({
          url: `${BASE}/movies/10/votes`,
          body: JSON.stringify({ 'name': 'TestName' }),
          headers: { 'Content-Type': 'application/json' }
        }, (err, res, body) => {
          if (err) {
            return done.fail(err);
          }
          expect(res.statusCode).toBe(404);
          try {
            const result = JSON.parse(body);
            expect(result.message).toMatch(/Not Found/);
            expect(result.errors[0].field).toBe('movie');
            expect(result.errors[0].code).toBe('not_exist');
            done();
          } catch (error) {
            done.fail(error);
          }
        });
      });
    });

  });

});
