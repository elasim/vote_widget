import mysql from 'mysql';
import fs from 'fs';
import path from 'path';

const SQL_CREATE_MOVIES = fs
  .readFileSync(path.join(__dirname, '../../query/create-movies.sql'))
  .toString();
const SQL_CREATE_USERS = fs
  .readFileSync(path.join(__dirname, '../../query/create-users.sql'))
  .toString();
const SQL_INSERT_MOVIE = `
  INSERT INTO Movies
    (title, director_name, summary)
  VALUES
    (?, ?, ?)
`;
const SQL_INSERT_USER = `
  INSERT INTO Users
    (name, movie_id)
  VALUES
    (?, ?)
`;

export async function prepare({ host, user, password, database }) {
  const dbConn = mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true
  });
  try {
    await reset(dbConn);
    return dbConn;
  } catch (error) {
    dbConn.close();
    throw error;
  }
}

export function reset(db) {
  return new Promise((resolve, reject) => {
    db.beginTransaction(async (error) => {
      if (error) {
        return reject(error);
      }
      try {
        await executeQuery(db, 'DROP TABLE IF EXISTS `users`');
        await executeQuery(db, 'DROP TABLE IF EXISTS `movies`');
        await executeQuery(db, SQL_CREATE_MOVIES);
        await executeQuery(db, SQL_CREATE_USERS);
        await executeCommit(db);
        resolve();
      } catch (e) {
        await executeRollback(db);
        reject(e);
      }
    });
  });
}

export async function createDummy(db) {
  const DUMMY_MOVIES = 3;
  const DUMMY_USERS = 10;
  try {
    for (let i=1; i<=DUMMY_MOVIES; i++) {
      await executeQuery(db, SQL_INSERT_MOVIE, [
        `Movie ${i}`,
        `Director ${i}`,
        `Summary ${i}`
      ]);
    }
    for (let i=1; i<=DUMMY_USERS; i++) {
      await executeQuery(db, SQL_INSERT_USER, [
        `User ${i}`,
        (i % DUMMY_MOVIES) + 1
      ]);
    }
    await executeCommit(db);
  } catch (error) {
    await executeRollback(db);
    throw error;
  }
}

function executeQuery(db, query, ...args) {
  return new Promise((resolve, reject) => {
    db.query(query, ...args, (error, result, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve([result, fields]);
      }
    });
  });
}

function executeCommit(db) {
  return new Promise((resolve, reject) => {
    db.commit(async error => {
      if (error) {
        await executeRollback(db);
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
}

function executeRollback(db) {
  return new Promise(resolve => {
    db.rollback(resolve);
  });
}
