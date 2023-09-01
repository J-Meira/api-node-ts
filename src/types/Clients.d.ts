export interface IClient {
  id: number;
  name: string;
  email: string;
  cityId: number;
}

export type TKClient = keyof IClient;

export interface IClientDTO extends Omit<IClient, 'id'> {}

export interface IClientsRDTO {
  records: IClient[];
  totalOfRecords: number;
}
