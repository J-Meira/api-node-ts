import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ICityDTO, IGetAllQuery, IIdParam } from '../../types';
import { validation } from '../../utils/middleware';
import {
  citySchema,
  getAllSchema,
  idParamSchema,
} from '../../utils/schemas';

export const createValidation = validation({ body: citySchema });

export const create = async (
  req: Request<{}, {}, ICityDTO>,
  res: Response,
) => {
  console.log(req.body);
  return res.status(StatusCodes.CREATED).json({ id: 1 });
};

export const deleteByIdValidation = validation({
  params: idParamSchema,
});

export const deleteById = async (
  req: Request<IIdParam>,
  res: Response,
) => {
  console.log(req.params);
  if (Number(req.params.id) === 99999)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ errors: ['Not Found'] });
  return res.status(StatusCodes.NO_CONTENT).end();
};

export const getAllValidation = validation({
  query: getAllSchema(['id', 'name', 'stateId']),
});

export const getAll = async (
  req: Request<{}, {}, {}, IGetAllQuery>,
  res: Response,
) => {
  console.log(req.query);
  return res.status(StatusCodes.OK).json({
    records: [
      {
        name: 'New York',
        stateId: 1,
      },
    ],
    totalOfRecords: 1,
  });
};

export const getByIdValidation = validation({
  params: idParamSchema,
});

export const getById = async (req: Request<IIdParam>, res: Response) => {
  console.log(req.params);
  if (Number(req.params.id) === 99999)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ errors: ['Not Found'] });
  return res.status(StatusCodes.OK).json({
    name: 'New York',
    stateId: 1,
  });
};

export const updateByIdValidation = validation({
  params: idParamSchema,
  body: citySchema,
});

export const updateById = async (
  req: Request<IIdParam, {}, ICityDTO>,
  res: Response,
) => {
  console.log(req.body);
  console.log(req.params);
  if (Number(req.params.id) === 99999)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ errors: ['Not Found'] });
  return res.status(StatusCodes.NO_CONTENT).end();
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
