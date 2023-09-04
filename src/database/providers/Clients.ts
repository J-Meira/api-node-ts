import { StatusCodes } from 'http-status-codes';

import { Knex } from '../knex';

import { StatusError } from '../../models';
import {
  IClient,
  IClientDTO,
  ICreateRDTO,
  IGetAllQuery,
} from '../../types';

import { ETableNames } from '../ETableNames';

const count = async (
  query: IGetAllQuery,
): Promise<number | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.clients)
      .where('name', 'like', `%${query.filter || ''}%`)
      .orWhere('email', 'like', `%${query.filter || ''}%`)
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
  data: IClientDTO,
): Promise<ICreateRDTO | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.cities)
      .where('id', '=', data.cityId)
      .count<[{ count: number }]>('* as count');

    if (count === 0) {
      return new StatusError(
        'Record Not Found for "cityId"',
        StatusCodes.BAD_REQUEST,
      );
    }

    const [{ count2 }] = await Knex(ETableNames.clients)
      .where('email', '=', data.email)
      .count<[{ count2: number }]>('* as count2');

    if (count2 > 0) {
      return new StatusError(
        'Email has already been registered',
        StatusCodes.BAD_REQUEST,
      );
    }

    const [result] = await Knex(ETableNames.clients).insert(data);
    return { id: result };
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while creating the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteById = async (id: number): Promise<void | StatusError> => {
  try {
    await Knex(ETableNames.clients).del().where('id', id);
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
): Promise<IClient[] | StatusError> => {
  try {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const result = await Knex.select('*')
      .from(ETableNames.clients)
      .where('id', query.id || 0)
      .orWhere('name', 'like', `%${query.filter || ''}%`)
      .orWhere('email', 'like', `%${query.filter || ''}%`)
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(query.orderBy || 'name', query.order);

    if (query.id && result.every((item) => item.id !== query.id)) {
      const resultById = await Knex(ETableNames.clients)
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

const getById = async (id: number): Promise<IClient | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.clients)
      .where('id', id)
      .first();

    if (result) return result;

    return new StatusError('Record Not Found', StatusCodes.BAD_REQUEST);
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
  data: IClientDTO,
): Promise<void | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.cities)
      .where('id', '=', data.cityId)
      .count<[{ count: number }]>('* as count');

    if (count === 0) {
      return new StatusError(
        'Record Not Found for "cityId"',
        StatusCodes.BAD_REQUEST,
      );
    }

    const [{ count2 }] = await Knex(ETableNames.clients)
      .where('email', '=', data.email)
      .andWhereNot('id', id)
      .count<[{ count2: number }]>('* as count2');

    if (count2 > 0) {
      return new StatusError(
        'Email has already been registered',
        StatusCodes.BAD_REQUEST,
      );
    }

    await Knex(ETableNames.clients).update(data).where('id', id);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while updating the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const ClientsProvider = {
  count,
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
