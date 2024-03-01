import express, { Response, Request } from 'express';
import { header } from 'express-validator';
import { getMoods } from '../service/mood';

const moodRouter = express.Router();

// get all mood entries
moodRouter.get(
  '/',
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const token = req.get('Authorization')!.substring(7);

    getMoods(token)
      .then((moods) => res.json({ moods }))
      .catch((err) => 'Error occured ' + err);
  },
);

export default moodRouter;
