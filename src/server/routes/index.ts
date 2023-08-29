import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/', (_, res) => res.status(StatusCodes.OK).send('Hi!'));

router.get('/test', (req, res) => {
  console.log(req);

  return res.status(StatusCodes.OK).json(req.body);
});

export { router };
