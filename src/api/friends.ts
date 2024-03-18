import express, { Response, Request } from 'express';
import { body, header, validationResult } from 'express-validator';
import { addFriend, getFriends } from '../service/friends';

const friendsRouter = express.Router();

/**
 * @swagger
 *   tags:
 *     - name: Friends
 *       description: Endpoints for managing friends and friend lists.
 */

/**
 * @swagger
 * definitions:
 *   Friend:
 *     type: object
 *     required:
 *       - userId
 *       - friendId
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier for the friend relationship. (Auto-generated)
 *       userId:
 *         type: integer
 *         description: ID of the user who owns this friend relationship.
 *       friendId:
 *         type: integer
 *         description: ID of the friend in this relationship.
 */

/**
 * @swagger
 * /api/friends/:
 *   get:
 *     description: Retrieves a list of friends of the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of friends.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Friend'
 *       400:
 *         description: Bad request (validation errors or other error during friend retrieval).
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 */
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

/**
 * @swagger
 * /api/friends/:
 *   post:
 *     description: Adds a new friend to the authenticated user's friend list.
 *     security:
 *       - BearerAuth: []
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: friendName
 *         description: Name of the friend to add.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Friend added successfully.
 *         schema:
 *           type: array
 *           items:
 *              type: string
 *       400:
 *         description: Bad request (validation errors, friend already exists, or other error during friend addition).
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 */
friendsRouter.post(
  '/',
  body('friendName').isString(),
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.get('Authorization')!.substring(7);
    addFriend(token, req.body.friendName)
      .then((r) => res.json(r))
      .catch((err) => res.status(400).send(err));
  },
);

export default friendsRouter;
