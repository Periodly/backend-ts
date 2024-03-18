import express, { Response, Request } from 'express';
import { body, header, validationResult } from 'express-validator';
import { addMood, getMoods } from '../service/mood';
import { moodOptions } from '../config';

const moodRouter = express.Router();

/**
 * @swagger
 *   tags:
 *     - name: Moods
 *       description: Endpoints for managing user moods.
 */

/**
 * @swagger
 * definitions:
 *   Mood:
 *     type: object
 *     required:
 *       - userId
 *       - mood
 *       - date
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier for the mood entry. (Auto-generated)
 *       userId:
 *         type: integer
 *         description: ID of the user who owns this mood entry.
 *       mood:
 *         type: string
 *         description: The user's mood at the recorded date/time.
 *       date:
 *         type: string
 *         format: date-time
 *         description: Date and time when the mood was recorded.
 */

/**
 * @swagger
 * definitions:
 *   MoodOptions:
 *     type: array
 *     enum:
 *       - happy
 *       - sad
 *       - angry
 *       - tired
 *       - hungry
 *       - excited
 *       - relaxed
 *       - stressed
 */

/**
 * @swagger
 * /api/mood/:
 *   get:
 *     description: Retrieves a list of the authenticated user's moods.
 *     security:
 *       - BearerAuth: []
 *     tags: [Moods]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of the user's moods.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Mood'
 *       400:
 *         description: Bad request (validation errors or other error during mood retrieval).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   description: Error message.
 */
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

/**
 * @swagger
 * /api/mood/list/:
 *   get:
 *     description: Retrieves a list of available mood options.
 *     tags: [Moods]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of available mood options.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: An individual mood option.
 */
moodRouter.get('/list', (req: Request, res: Response) => {
  res.json({ moods: moodOptions });
});

/**
 * @swagger
 * /api/mood/:
 *   post:
 *     description: Creates a new mood entry for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     tags: [Moods]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: mood
 *         description: The user's mood.
 *         required: true
 *         type: string
 *         enum:
 *           $ref: '#/definitions/MoodOptions'
 *     responses:
 *       200:
 *         description: Mood created successfully.
 *       400:
 *         description: Bad request (validation errors, invalid mood option, or other error during mood creation).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
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
moodRouter.post(
  '/',
  header('Authorization').isString().contains('Bearer'),
  body('mood').isString().isIn(moodOptions),
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
