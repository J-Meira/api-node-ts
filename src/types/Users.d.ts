export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface ISignInDTO2 {
  email: string;
  password: string;
}

export type TKUser = keyof IUser;

export interface IUserDTO extends Omit<IUser, 'id'> {}

export interface ISignInDTO extends Omit<IUser, 'id' | 'name'> {}

export interface ICitiesRDTO {
  records: IUser[];
  totalOfRecords: number;
}
