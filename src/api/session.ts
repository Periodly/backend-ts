import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { minPasswordLength } from '../config';
import { login } from '../service/session';

const sessionRouter = express.Router();

/**
 * @swagger
 *   tags:
 *     - name: Authentication
 *       description: Endpoints for authenticating users.
 */

/**
 * @swagger
 * /api/session/login/:
 *   post:
 *     description: Logs in a user and retrieves a JSON Web Token (JWT) for authentication.
 *     tags: [Authentication]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         description: Login credentials
 *         required: true
 *         type: object
 *         properties:
 *           username:
 *             type: string
 *             description: The user's username or email address.
 *             required: true
 *           password:
 *             type: string
 *             description: The user's password.
 *             required: true
 *             minLength: ${minPasswordLength}
 *     responses:
 *       200:
 *         description: Login successful. Response includes a JWT for authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT for authentication.
 *       400:
 *         description: Bad request (validation errors, invalid credentials, or other error during login).
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
 *         description: Unauthorized (invalid credentials).
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
sessionRouter.post(
  '/login',
  body('username').isString(),
  body('password').isString().isLength({
    min: minPasswordLength,
  }),
  (req: Request, res: Response) => {
    login(req.body.username, req.body.password)
      .then((token) => res.json({ token }))
      .catch((err) => res.status(401).send(err));
  },
);

export default sessionRouter;
