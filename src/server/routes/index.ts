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

router.get(
  '/cities',
  CitiesController.getAllValidation,
  CitiesController.getAll,
);

router.get(
  '/cities/:id',
  CitiesController.getByIdValidation,
  CitiesController.getById,
);

router.delete(
  '/cities/:id',
  CitiesController.deleteByIdValidation,
  CitiesController.deleteById,
);

router.put(
  '/cities/:id',
  CitiesController.updateByIdValidation,
  CitiesController.updateById,
);

export { router };
