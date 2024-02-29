import mariadb from 'mariadb';

export const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  database: 'prdly',
  connectionLimit: 5
});