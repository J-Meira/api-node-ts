import { StatusCodes } from 'http-status-codes';

import { Knex } from '../knex';

import { StatusError } from '../../models';
import { ICity, ICityDTO, ICreateRDTO, IGetAllQuery } from '../../types';

import { ETableNames } from '../ETableNames';

const count = async (
  query: IGetAllQuery,
): Promise<number | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.cities)
      .where('name', 'like', `%${query.filter || ''}%`)
      .count<[{ count: number }]>('* as count');

    return Number.isInteger(Number(count)) ? Number(count) : 0;
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching records',
      500,
    );
  }
};

const create = async (
  data: ICityDTO,
): Promise<ICreateRDTO | StatusError> => {
  try {
    const [result] = await Knex(ETableNames.cities).insert(data);
    return { id: result };
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while creating the record',
      500,
    );
  }
};

const deleteById = async (id: number): Promise<void | StatusError> => {
  try {
    await Knex(ETableNames.cities).del().where('id', id);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while deleting the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getAll = async (
  query: IGetAllQuery,
): Promise<ICity[] | StatusError> => {
  try {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const result = await Knex.select('*')
      .from(ETableNames.cities)
      .where('id', query.id || 0)
      .orWhere('name', 'like', `%${query.filter || ''}%`)
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(query.orderBy || 'name', query.order);

    if (query.id && result.every((item) => item.id !== query.id)) {
      const resultById = await Knex(ETableNames.cities)
        .select('*')
        .where('id', query.id)
        .first();

      if (resultById) return [...result, resultById];
    }

    return result;
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching records',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getById = async (id: number): Promise<ICity | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.cities)
      .where('id', id)
      .first();
    return result
      ? result
      : new StatusError('Record Not Found', StatusCodes.BAD_REQUEST);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateById = async (
  id: number,
  data: ICityDTO,
): Promise<void | StatusError> => {
  try {
    await Knex(ETableNames.cities).update(data).where('id', id);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while updating the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const CitiesProvider = {
  count,
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
