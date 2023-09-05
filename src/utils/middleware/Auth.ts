import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleErrors } from './HandleErrors';
import { StatusError } from '../../models';

const user: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return handleErrors(
      new StatusError('Without token', StatusCodes.UNAUTHORIZED),
      res,
    );
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer') {
    return handleErrors(
      new StatusError(
        'invalid authorization type',
        StatusCodes.UNAUTHORIZED,
      ),
      res,
    );
  }
  if (!token || token !== 'test.test.test') {
    return handleErrors(
      new StatusError('invalid token', StatusCodes.UNAUTHORIZED),
      res,
    );
  }

  return next();
};

export const Auth = {
  user,
};
