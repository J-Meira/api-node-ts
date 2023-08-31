import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.cities, (table) => {
      table.bigIncrements('id').primary().index();
      table.string('name', 60).checkLength('<=', 60).index().notNullable();
      table.bigInteger('stateId').index();
    })
    .then(() => {
      console.log(`# Created Table: ${ETableNames.cities}!`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.cities).then(() => {
    console.log(`# Dropped Table: ${ETableNames.cities}!`);
  });
}
