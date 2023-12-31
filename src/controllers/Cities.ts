import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { StatusError } from '../models';
import { ICityDTO, IGetAllQuery, IIdParam, TKCity } from '../types';

import { CitiesProvider } from '../database/providers';

import { handleErrors, validation } from '../utils/middleware';
import { citySchema, getAllSchema, idParamSchema } from '../utils/schemas';

const handleIdParams = (res: Response) =>
  handleErrors(
    new StatusError('Param "id" is a required', StatusCodes.BAD_REQUEST),
    res,
  );

const createValidation = validation({ body: citySchema });

const create = async (req: Request<{}, {}, ICityDTO>, res: Response) => {
  const result = await CitiesProvider.create(req.body);
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

  const test = await CitiesProvider.getById(req.params.id);
  if (!(test instanceof StatusError)) {
    const result = await CitiesProvider.deleteById(req.params.id);

    if (result instanceof StatusError) {
      return handleErrors(result, res);
    } else {
      return res.status(StatusCodes.NO_CONTENT).end();
    }
  } else {
    return handleErrors(test, res);
  }
};

const orderKeys: TKCity[] = ['id', 'name', 'stateId'];

const getAllValidation = validation({
  query: getAllSchema(orderKeys),
});

const getAll = async (
  req: Request<{}, {}, {}, IGetAllQuery>,
  res: Response,
) => {
  const result = await CitiesProvider.getAll(req.query);
  const count = await CitiesProvider.count(req.query);
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

  const result = await CitiesProvider.getById(req.params.id);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.OK).json(result);
  }
};

const updateByIdValidation = validation({
  params: idParamSchema,
  body: citySchema,
});

const updateById = async (
  req: Request<IIdParam, {}, ICityDTO>,
  res: Response,
) => {
  if (!req.params.id) return handleIdParams(res);
  const test = await CitiesProvider.getById(req.params.id);
  if (!(test instanceof StatusError)) {
    const result = await CitiesProvider.updateById(
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

export const CitiesController = {
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
