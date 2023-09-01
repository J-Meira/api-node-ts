import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { StatusError } from '../models';
import { IClientDTO, IGetAllQuery, IIdParam, TKClient } from '../types';

import { ClientsProvider } from '../database/providers';

import { handleErrors, validation } from '../utils/middleware';
import {
  clientSchema,
  getAllSchema,
  idParamSchema,
} from '../utils/schemas';

const handleIdParams = (res: Response) =>
  handleErrors(
    new StatusError('Param "id" is a required', StatusCodes.BAD_REQUEST),
    res,
  );

const createValidation = validation({ body: clientSchema });

const create = async (req: Request<{}, {}, IClientDTO>, res: Response) => {
  const result = await ClientsProvider.create(req.body);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.CREATED).json(result);
  }
};

const deleteByIdValidation = validation({
  params: idParamSchema,
});

const deleteById = async (req: Request<IIdParam>, res: Response) => {
  if (!req.params.id) return handleIdParams(res);

  const test = await ClientsProvider.getById(req.params.id);
  if (!(test instanceof StatusError)) {
    const result = await ClientsProvider.deleteById(req.params.id);

    if (result instanceof StatusError) {
      return handleErrors(result, res);
    } else {
      return res.status(StatusCodes.NO_CONTENT).end();
    }
  } else {
    return handleErrors(test, res);
  }
};

const orderKeys: TKClient[] = ['id', 'name', 'email', 'cityId'];

const getAllValidation = validation({
  query: getAllSchema(orderKeys),
});

const getAll = async (
  req: Request<{}, {}, {}, IGetAllQuery>,
  res: Response,
) => {
  const result = await ClientsProvider.getAll(req.query);
  const count = await ClientsProvider.count(req.query);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else if (count instanceof StatusError) {
    return handleErrors(count, res);
  } else {
    return res.status(StatusCodes.OK).json({
      records: result,
      totalOfRecords: count,
    });
  }
};

const getByIdValidation = validation({
  params: idParamSchema,
});

const getById = async (req: Request<IIdParam>, res: Response) => {
  if (!req.params.id) return handleIdParams(res);

  const result = await ClientsProvider.getById(req.params.id);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.OK).json(result);
  }
};

const updateByIdValidation = validation({
  params: idParamSchema,
  body: clientSchema,
});

const updateById = async (
  req: Request<IIdParam, {}, IClientDTO>,
  res: Response,
) => {
  if (!req.params.id) return handleIdParams(res);

  console.log(req.body);
  console.log(req.params);
  const test = await ClientsProvider.getById(req.params.id);
  if (!(test instanceof StatusError)) {
    const result = await ClientsProvider.updateById(
      req.params.id,
      req.body,
    );

    if (result instanceof StatusError) {
      return handleErrors(result, res);
    } else {
      return res.status(StatusCodes.NO_CONTENT).end();
    }
  } else {
    return handleErrors(test, res);
  }
};

export const ClientsController = {
  create,
  createValidation,
  deleteById,
  deleteByIdValidation,
  getAll,
  getAllValidation,
  getById,
  getByIdValidation,
  updateById,
  updateByIdValidation,
};
