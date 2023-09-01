export interface ICity {
  id: number;
  name: string;
  stateId: number;
}

export type TKCity = keyof ICity;

export interface ICityDTO extends Omit<ICity, 'id'> {}

export interface ICitiesRDTO {
  records: ICity[];
  totalOfRecords: number;
}
