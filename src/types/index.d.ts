export * from './Cities';
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
