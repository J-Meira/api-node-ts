import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ICityCreate } from '../../types';
import { validation } from '../../utils/middleware';
import { cityCreateSchema } from '../../utils/schemas';

export const createValidation = validation({ body: cityCreateSchema });

export const create = async (
  req: Request<{}, {}, ICityCreate>,
  res: Response,
) => {
  console.log(req.body);
  return res.status(StatusCodes.CREATED).send('created!');
};
