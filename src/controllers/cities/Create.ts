import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ICities } from '../../types';

export const create = (req: Request<{}, {}, ICities>, res: Response) => {
  console.log(req.body.name);
  return res.status(StatusCodes.CREATED).send('created!');
};
