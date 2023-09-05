import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CitiesController, ClientsController } from '../../controllers';
import { UsersController } from '../../controllers/Users';
import { Auth } from '../../utils/middleware';

const router = Router();

/* heth start */
router.get('/', (_, res) => res.status(StatusCodes.OK).send('Hi!'));
/* heth end */

/* cities start */
router.post(
  '/cities',
  Auth.user,
  CitiesController.createValidation,
  CitiesController.create,
);

router.get(
  '/cities',
  Auth.user,
  CitiesController.getAllValidation,
  CitiesController.getAll,
);

router.get(
  '/cities/:id',
  Auth.user,
  CitiesController.getByIdValidation,
  CitiesController.getById,
);

router.delete(
  '/cities/:id',
  Auth.user,
  CitiesController.deleteByIdValidation,
  CitiesController.deleteById,
);

router.put(
  '/cities/:id',
  Auth.user,
  CitiesController.updateByIdValidation,
  CitiesController.updateById,
);
/* cities end */

/* clients start */
router.post(
  '/clients',
  Auth.user,
  ClientsController.createValidation,
  ClientsController.create,
);

router.get(
  '/clients',
  Auth.user,
  ClientsController.getAllValidation,
  ClientsController.getAll,
);

router.get(
  '/clients/:id',
  Auth.user,
  ClientsController.getByIdValidation,
  ClientsController.getById,
);

router.delete(
  '/clients/:id',
  Auth.user,
  ClientsController.deleteByIdValidation,
  ClientsController.deleteById,
);

router.put(
  '/clients/:id',
  Auth.user,
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
  Auth.user,
  UsersController.getAllValidation,
  UsersController.getAll,
);

router.get(
  '/users/:id',
  Auth.user,
  UsersController.getByIdValidation,
  UsersController.getById,
);

router.put(
  '/users/:id',
  Auth.user,
  UsersController.updateByIdValidation,
  UsersController.updateById,
);
/* users end */

export { router };
