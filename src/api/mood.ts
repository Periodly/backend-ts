import express, { Response, Request } from 'express';
import { header, validationResult } from 'express-validator';
import { addMood, getMoods } from '../service/mood';

const moodRouter = express.Router();

// get all mood entries
moodRouter.get(
  '/',
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.get('Authorization')!.substring(7);
    getMoods(token)
      .then((moods) => res.json({ moods }))
      .catch((err) => 'Error occured ' + err);
  },
);

// add a new mood entry
moodRouter.post(
  '/',
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.get('Authorization')!.substring(7);
    addMood(token, req.body.mood)
      .then(() => res.sendStatus(200))
      .catch((err) => 'Error occured ' + err);
  },
);

export default moodRouter;
