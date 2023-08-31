import { knex } from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexEnv = require('../../../knex.env');
const env = process.env.NODE_ENV || 'development';

export const Knex = knex(knexEnv[env]);
