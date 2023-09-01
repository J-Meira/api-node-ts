import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.clients, (table) => {
      table.bigIncrements('id').primary().index();
      table.string('name', 150).index().notNullable();
      table.string('email', 150).unique().notNullable();

      table
        .bigInteger('cityId')
        .unsigned()
        .index()
        .notNullable()
        .references('id')
        .inTable(ETableNames.cities)
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
    })
    .then(() => {
      console.log(`# Created Table: ${ETableNames.clients}!`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.clients).then(() => {
    console.log(`# Dropped Table: ${ETableNames.clients}!`);
  });
}
