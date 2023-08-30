import { Knex } from 'knex';
import path from 'path';

export const development: Knex.Config = {
  client: 'mysql',
  useNullAsDefault: true,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  migrations: {
    directory: path.resolve(__dirname, '..', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'seeds'),
  },
};

export const test: Knex.Config = {
  ...development,
  connection: ':memory:',
  pool: {
    afterCreate: (connection: any, done: Function) => {
      connection.run('PRAGMA foreign_keys = ON');
      done();
    },
  },
};

export const production: Knex.Config = {
  ...development,
  connection: {
    host: process.env.RDS_HOSTNAME,
    port: Number(process.env.RDS_PORT || 3306),
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
  },
};
