import express, { Response, Request } from 'express';
import { body, header, validationResult } from 'express-validator';
import { addFriend, getFriends } from '../service/friends';

const friendsRouter = express.Router();

// get all friends
friendsRouter.get(
  '/',
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.get('Authorization')!.substring(7);
    getFriends(token)
      .then((friends) => res.json({ friends }))
      .catch((err) => res.status(400).send(err));
  },
);

// add a new friend
friendsRouter.post(
  '/',
  body('friendId').isNumeric(),
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.get('Authorization')!.substring(7);
    addFriend(token, req.body.friendId)
      .then((r) => res.json(r))
      .catch((err) => res.status(400).send(err));
  },
);

export default friendsRouter;
