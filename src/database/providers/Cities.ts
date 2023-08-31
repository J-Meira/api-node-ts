import { ICityDTO } from '../../types';
import { ETableNames } from '../ETableNames';
import { Knex } from '../knex';

export const create = async (city: ICityDTO): Promise<number | Error> => {
  try {
    const [result] = await Knex(ETableNames.cities).insert(city);
    return result;
  } catch (error) {
    console.error(error);
    return Error('Create error.');
  }
};

export const CitiesProvider = {
  create,
};
