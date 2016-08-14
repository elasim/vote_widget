import fs from 'fs';
import path from 'path';
import mysql from 'mysql';

const SQL_CREATE_MOVIES = fs
  .readFileSync(path.join(__dirname, '../../query/create-movies.sql'))
  .toString();
const SQL_CREATE_USERS = fs
  .readFileSync(path.join(__dirname, '../../query/create-users.sql'))
  .toString();

let pool, getConnection;

export default {
  async configure(param) {
    pool = mysql.createPool({
      ...param,
      multipleStatements: true
    });
    getConnection = promisify(pool::pool.getConnection);

    await query(SQL_CREATE_MOVIES);
    await query(SQL_CREATE_USERS);
    if (process.env.NODE_ENV === 'development') {
      const SQL_INSERT_MOVIES = fs
        .readFileSync(path.join(__dirname, '../../query/insert-movies.sql'))
        .toString();
      await query(SQL_INSERT_MOVIES);
      const SQL_INSERT_USERS = fs
        .readFileSync(path.join(__dirname, '../../query/insert-users.sql'))
        .toString();
      await query(SQL_INSERT_USERS);
    }
  },
  close,
  query
};

async function query(queryString, params) {
  const [conn] = await getConnection();
  const $query = promisify(conn::conn.query);
  try {
    const [results] = await $query(queryString, params);
    conn.release();
    return results;
  } catch (e) {
    conn.release();
    throw e;
  }
}

function close() {
  return promisify(pool::pool.end)();
}

function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, ...results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}
