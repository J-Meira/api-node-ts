import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CitiesController, ClientsController } from '../../controllers';
import { UsersController } from '../../controllers/Users';

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

/* auth start */
router.post(
  '/sign-in',
  UsersController.signInValidation,
  UsersController.signIn,
);

router.post(
  '/sign-up',
  UsersController.signUpValidation,
  UsersController.signUp,
);
/* auth end */

/* users start */
router.get(
  '/users',
  UsersController.getAllValidation,
  UsersController.getAll,
);

router.get(
  '/users/:id',
  UsersController.getByIdValidation,
  UsersController.getById,
);

router.put(
  '/users/:id',
  UsersController.updateByIdValidation,
  UsersController.updateById,
);
/* users end */

export { router };
