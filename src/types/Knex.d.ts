import { ICity } from './Cities';
declare module 'knex/types/tables' {
  interface Tables {
    cities: ICity;
    // client: IClient
    // state: IState
    // user: IUser
  }
}
