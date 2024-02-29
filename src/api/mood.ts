import express, { Response, Request } from 'express';
import { header } from 'express-validator';

const moodRouter = express.Router();

// user registration
moodRouter.get(
  '/',
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const token = req.get('Authorization')!.substring(7);

    getMoods(token)
      .then(() => res.sendStatus(200))
      .catch((err) => 'Error occured ' + err);
  },
);

export default moodRouter;
