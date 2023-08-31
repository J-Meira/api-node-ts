import path from 'path';
import 'dotenv/config';

module.exports = {
  development: {
    client: 'mysql2',
    version: '8.0',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
  },
  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: ':memory:',
    pool: {
      afterCreate: (connection: any, done: Function) => {
        connection.run('PRAGMA foreign_keys = ON');
        done();
      },
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
  },
  production: {
    client: 'mysql2',
    version: '8.0',
    connection: {
      host: process.env.RDS_HOSTNAME,
      port: Number(process.env.RDS_PORT || '3306'),
      user: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
  },
};
