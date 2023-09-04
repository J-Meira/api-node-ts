import { ICity, IClient, IUser } from './';
declare module 'knex/types/tables' {
  interface Tables {
    cities: ICity;
    client: IClient;
    user: IUser;
  }
}
