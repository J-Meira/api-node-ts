import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { StatusError } from '../models';
import {
  IUserDTO,
  IGetAllQuery,
  IIdParam,
  TKUser,
  ISignInDTO,
} from '../types';

import { UsersProvider } from '../database/providers';

import { handleErrors, validation } from '../utils/middleware';
import {
  userSchema,
  getAllSchema,
  idParamSchema,
  signInSchema,
} from '../utils/schemas';
import {
  ExpireInService,
  HashService,
  JWTService,
} from '../utils/services';

const userSecret = process.env.SYSTEM_SECRET;

const handleIdParams = (res: Response) =>
  handleErrors(
    new StatusError('Param "id" is a required', StatusCodes.BAD_REQUEST),
    res,
  );

const signUpValidation = validation({ body: userSchema });

const signUp = async (req: Request<{}, {}, IUserDTO>, res: Response) => {
  const result = await UsersProvider.create(req.body);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.CREATED).json(result);
  }
};

const orderKeys: TKUser[] = ['id', 'name', 'email'];

const getAllValidation = validation({
  query: getAllSchema(orderKeys),
});

const getAll = async (
  req: Request<{}, {}, {}, IGetAllQuery>,
  res: Response,
) => {
  const result = await UsersProvider.getAll(req.query);
  const count = await UsersProvider.count(req.query);
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

  const result = await UsersProvider.getById(req.params.id);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.OK).json(result);
  }
};

const updateByIdValidation = validation({
  params: idParamSchema,
  body: userSchema,
});

const updateById = async (
  req: Request<IIdParam, {}, IUserDTO>,
  res: Response,
) => {
  if (!req.params.id) return handleIdParams(res);
  const test = await UsersProvider.getById(req.params.id);
  if (!(test instanceof StatusError)) {
    const result = await UsersProvider.updateById(req.params.id, req.body);

    if (result instanceof StatusError) {
      return handleErrors(result, res);
    } else {
      return res.status(StatusCodes.NO_CONTENT).end();
    }
  } else {
    return handleErrors(test, res);
  }
};

const signInValidation = validation({
  body: signInSchema,
});

const signIn = async (req: Request<{}, {}, ISignInDTO>, res: Response) => {
  const { email, password } = req.body;

  const user = await UsersProvider.getByEmail(email);

  if (user instanceof StatusError) {
    return handleErrors(user, res);
  }

  const passwordTest = await HashService.verify(password, user.password);

  if (!passwordTest)
    return handleErrors(
      new StatusError(
        'email or password are not valid',
        StatusCodes.UNAUTHORIZED,
      ),
      res,
    );

  if (!userSecret)
    return handleErrors(
      new StatusError(
        'Internal server error',
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
      res,
    );

  const expiresIn = ExpireInService.get(24);
  const accessToken = JWTService.make(
    {
      uid: user.id,
      name: user.name,
      expiresIn,
    },
    userSecret,
    '24h',
  );
  return res.status(StatusCodes.OK).json({ accessToken, expiresIn });
};

export const UsersController = {
  getAll,
  getAllValidation,
  getById,
  getByIdValidation,
  updateById,
  updateByIdValidation,
  signIn,
  signInValidation,
  signUp,
  signUpValidation,
};
