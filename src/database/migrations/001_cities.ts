import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.cities, (table) => {
      table.bigIncrements('id').primary().index();
      table.string('name', 60).index().notNullable();
      table.bigInteger('stateId').index();
    })
    .then(() => {
      console.log(`# ${ETableNames.cities} Table Created`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.cities).then(() => {
    console.log(`# ${ETableNames.cities} Table Dropped`);
  });
}
