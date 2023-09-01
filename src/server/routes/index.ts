import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CitiesController, ClientsController } from '../../controllers';

const router = Router();

/* heth start */
router.get('/', (_, res) => res.status(StatusCodes.OK).send('Hi!'));
/* heth end */

/* cities start */
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
/* cities end */

/* clients start */
router.post(
  '/clients',
  ClientsController.createValidation,
  ClientsController.create,
);

router.get(
  '/clients',
  ClientsController.getAllValidation,
  ClientsController.getAll,
);

router.get(
  '/clients/:id',
  ClientsController.getByIdValidation,
  ClientsController.getById,
);

router.delete(
  '/clients/:id',
  ClientsController.deleteByIdValidation,
  ClientsController.deleteById,
);

router.put(
  '/clients/:id',
  ClientsController.updateByIdValidation,
  ClientsController.updateById,
);
/* clients end */

export { router };
