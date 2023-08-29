import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CitiesController } from '../../controllers';

const router = Router();

router.get('/', (_, res) => res.status(StatusCodes.OK).send('Hi!'));

router.post(
  '/cities',
  CitiesController.createValidation,
  CitiesController.create,
);

export { router };
