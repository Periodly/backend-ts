import express, { Response, Request } from 'express';
import { body, header } from 'express-validator';
import { minPasswordLength } from '../config';
import { createUser } from '../service/user';

const userRouter = express.Router();

// user registration
userRouter.post(
  '/',
  body('username').isString(),
  body('password').isString().isLength({
    min: minPasswordLength,
  }),
  body('admin').isBoolean(),
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const token = req.get('Authorization')!.substring(7);

    createUser(req.body.username, req.body.password, req.body.admin, token)
      .then(() => res.sendStatus(200))
      .catch((err) => 'Error occured ' + err);
  },
);

export default userRouter;
