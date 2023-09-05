import { StatusCodes } from 'http-status-codes';

import { Knex } from '../knex';

import { StatusError } from '../../models';
import { IUser, IUserDTO, ICreateRDTO, IGetAllQuery } from '../../types';

import { ETableNames } from '../ETableNames';
import { HashService } from '../../utils/services';

const count = async (
  query: IGetAllQuery,
): Promise<number | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.users)
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
  data: IUserDTO,
): Promise<ICreateRDTO | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.users)
      .where('email', '=', data.email)
      .count<[{ count: number }]>('* as count');

    if (count > 0) {
      return new StatusError(
        'Email has already been registered',
        StatusCodes.BAD_REQUEST,
      );
    }

    const hashPassword = await HashService.make(data.password);
    const [result] = await Knex(ETableNames.users).insert({
      ...data,
      password: hashPassword,
    });

    return { id: result };
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while creating the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getAll = async (
  query: IGetAllQuery,
): Promise<IUser[] | StatusError> => {
  try {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const result = await Knex.select('*')
      .from(ETableNames.users)
      .where('id', query.id || 0)
      .orWhere('name', 'like', `%${query.filter || ''}%`)
      .orWhere('email', 'like', `%${query.filter || ''}%`)
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(query.orderBy || 'name', query.order);

    if (query.id && result.every((item) => item.id !== query.id)) {
      const resultById = await Knex(ETableNames.users)
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

const getById = async (id: number): Promise<IUser | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.users)
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

const getByEmail = async (email: string): Promise<IUser | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.users)
      .where('email', email)
      .first();

    if (result) return result;

    return new StatusError(
      'email or password are not valid',
      StatusCodes.UNAUTHORIZED,
    );
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
  data: IUserDTO,
): Promise<void | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.users)
      .where('email', '=', data.email)
      .andWhereNot('id', id)
      .count<[{ count: number }]>('* as count');

    if (count > 0) {
      return new StatusError(
        'Email has already been registered',
        StatusCodes.BAD_REQUEST,
      );
    }

    await Knex(ETableNames.users).update(data).where('id', id);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while updating the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const UsersProvider = {
  count,
  create,
  getAll,
  getById,
  getByEmail,
  updateById,
};
