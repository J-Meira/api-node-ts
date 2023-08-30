export * from './Cities';
export * from './Knex';
export * from './Validation';

export type TOrder = 'asc' | 'desc';

export interface IGetAllQuery {
  page?: number;
  limit?: number;
  filter?: string;
  orderBy?: string;
  order?: TOrder;
  id?: number;
}
export interface IIdParam {
  id?: number;
}

export interface ICreateUpdateRDTO {
  id: number;
}
