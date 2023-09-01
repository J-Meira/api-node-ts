import { ICity, IClient } from './';
declare module 'knex/types/tables' {
  interface Tables {
    cities: ICity;
    client: IClient;
    // state: IState
    // user: IUser
  }
}
