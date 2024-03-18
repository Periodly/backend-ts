import express, { Response, Request } from 'express';
import { body, header, validationResult } from 'express-validator';
import { minPasswordLength } from '../config';
import { createUser } from '../service/user';

const userRouter = express.Router();

/**
 * @swagger
 *   tags:
 *     - name: Users
 *       description: Endpoints for managing user accounts.
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

export default userRouter;
