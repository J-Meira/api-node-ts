export interface ICity {
  id: number;
  name: string;
  stateId: number;
}

export interface ICityDTO extends Omit<ICity, 'id'> {}
