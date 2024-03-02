import express, { Response, Request } from 'express';
import { body, header, validationResult } from 'express-validator';
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
  body('isAdmin').optional().isBoolean(),
  body('isAdmin').custom((value, { req }) => {
    if (value && !req.headers!.authorization) {
      throw new Error('Authorization needed');
    }
    return true;
  }),
  header('Authorization').optional().isString(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const isAdmin = req.body.isAdmin || false;
    const token = req.get('Authorization')!.substring(7);
    createUser(req.body.username, req.body.password, isAdmin, token)
      .then(() => res.sendStatus(200))
      .catch((err) => res.status(400).send(err));
  },
);

export default userRouter;
