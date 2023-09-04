import { ObjectSchema, mixed, number, object, string } from 'yup';
import {
  ICityDTO,
  IClientDTO,
  IGetAllQuery,
  IIdParam,
  ISignInDTO,
  IUserDTO,
  TOrder,
} from '../../types';

export const citySchema: ObjectSchema<ICityDTO> = object({
  name: string().required().min(3).max(60),
  stateId: number().integer().required().min(1),
});

export const clientSchema: ObjectSchema<IClientDTO> = object({
  name: string().required().min(3).max(150),
  email: string().email().required(),
  cityId: number().integer().required().min(1),
});

export const userSchema: ObjectSchema<IUserDTO> = object({
  name: string().required().min(3).max(150),
  email: string().email().required(),
  password: string()
    .required()
    .test({
      name: 'password',
      skipAbsent: true,
      test(value, ctx) {
        const fTest = !(
          value.match(/[a-z]/) &&
          value.match(/[A-Z]/) &&
          value.match(/\d+/) &&
          value.match(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
        );
        if (value.length < 8) {
          return ctx.createError({
            message: 'password must be at least 8 characters',
          });
        } else if (fTest) {
          return ctx.createError({
            message:
              'password invalid, must including at least one number, one  upper case letter, one  down case letter and one special character',
          });
        }
        return true;
      },
    }),
});

export const signInSchema: ObjectSchema<ISignInDTO> = object({
  email: string().required(),
  password: string().required(),
});

export const idParamSchema: ObjectSchema<IIdParam> = object({
  id: number().integer().required().min(1),
});

export const getAllSchema = (
  orderByList: string[],
): ObjectSchema<IGetAllQuery> => {
  type TOrderBy = (typeof orderByList)[number];

  return object({
    page: number().integer().optional().min(1),
    limit: number().integer().optional().min(1),
    filter: string().optional().max(30),
    orderBy: mixed<TOrderBy>()
      .optional()
      .oneOf([...orderByList]),
    order: mixed<TOrder>().optional().oneOf(['asc', 'desc']),
    id: number().integer().optional().positive(),
  });
};
