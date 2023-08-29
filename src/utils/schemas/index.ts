import { ObjectSchema, number, object, string } from 'yup';
import { ICityCreate } from '../../types';

export const cityCreateSchema: ObjectSchema<ICityCreate> = object({
  name: string().required().min(3).max(150),
  id: number().required().positive(),
});
