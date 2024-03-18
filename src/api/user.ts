import express, { Response, Request } from 'express';
import { body, header, validationResult } from 'express-validator';
import { minPasswordLength } from '../config';
import { createUser, deleteUser, getAllUsers } from '../service/user';

const userRouter = express.Router();

/**
 * @swagger
 *   tags:
 *     - name: Users
 *       description: Endpoints for managing user accounts.
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - isAdmin
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier for the user. (Auto-generated)
 *       username:
 *         type: string
 *         description: The user's username.
 *       isAdmin:
 *         type: boolean
 *         description: Whether the user has admin privileges.
 */

/**
 * @swagger
 * /api/user/:
 *   post:
 *     description: Creates a new user account.
 *     security:
 *       - BearerAuth: []
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User information
 *         required: true
 *         type: object
 *         properties:
 *           username:
 *             type: string
 *             description: The user's username.
 *             required: true
 *           password:
 *             type: string
 *             description: The user's password.
 *             required: true
 *             minLength: ${minPasswordLength}
 *           isAdmin:
 *             type: boolean
 *             description: Whether the user is an administrator (optional).
 *             default: false
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for admin users creating new users (optional).
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: Bad request (validation errors, authorization required for creating admins, or other error during user creation).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized (missing or invalid authorization token for creating admins).
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
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

/**
 * @swagger
 * /api/user/list/:
 *   get:
 *     description: Retrieves a list of all users. (Requires admin privileges)
 *     security:
 *       - BearerAuth: []
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       400:
 *         description: Bad request (validation errors or other error during user retrieval).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized (missing or invalid authorization token).
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
userRouter.get(
  '/list',
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.get('Authorization')!.substring(7);
    getAllUsers(token)
      .then((r) => res.json(r))
      .catch((err) => res.status(401).send(err));
  },
);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     description: Deletes a user by ID. (Requires admin privileges)
 *     security:
 *       - BearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The user's unique identifier.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Bad request (validation errors, authorization required, or other error during user deletion).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Forbidden (insufficent privileges to delete user).
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

userRouter.delete(
  '/:id',
  header('Authorization').isString().contains('Bearer'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.get('Authorization')!.substring(7);
    deleteUser(token, req.params.id)
      .then(() => res.sendStatus(200))
      .catch((err) => res.status(403).send(err));
  },
);

export default userRouter;
