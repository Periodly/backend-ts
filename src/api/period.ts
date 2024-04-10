import { Router, Request, Response } from 'express';
import { body, header, validationResult } from 'express-validator';
import {
  getCurrentPeriodCycle,
  getPreviousPeriodCycles,
  getTypicalPeriod,
  initNewPeriodCycle,
  recordMood,
  recordSymptom,
  updateTypicalPeriod,
} from '../service/period';
import { moodOptions } from '../config';

const periodRouter = Router();

/**
 * @swagger
 *   tags:
 *     - name: Period Tracking
 *       description: Endpoints for managing period tracking, predictions, symptoms and moods.
 */

/**
 * @swagger
 * definitions:
 *   Mood:
 *     type: object
 *     required:
 *       - cycleId
 *       - mood
 *       - date
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier for the mood entry. (Auto-generated)
 *       cycleId:
 *         type: integer
 *         description: ID of the cycle to which this mood entry belongs.
 *       mood:
 *         type: string
 *         description: The user's mood at the recorded date/time.
 *       date:
 *         type: string
 *         format: date-time
 *         description: Date and time when the mood was recorded.
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
 *   Symptom:
 *     type: object
 *     required:
 *       - date
 *       - cycleId
 *       - symptom
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier for the symptom entry. (Auto-generated)
 *         readOnly: true
 *         example: 1
 *       date:
 *         type: string
 *         format: date-time
 *         description: Date and time when the symptom was recorded.
 *         example: 2021-01-01T00:00:00Z
 *       cycleId:
 *         type: integer
 *         description: ID of the period cycle to which this symptom entry belongs.
 *         example: 1
 *       symptom:
 *         type: string
 *         description: The symptom experienced by the user.
 *         example: cramps
 *   TypicalPeriod:
 *     type: object
 *     required:
 *       - userId
 *       - cycleLength
 *       - regularity
 *       - mostCommonSymptom
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier for the typical period. (Auto-generated)
 *         readOnly: true
 *         example: 1
 *       userId:
 *         type: integer
 *         description: ID of the user who owns this typical period record.
 *         example: 1
 *       cycleLength:
 *         type: integer
 *         description: The average length of the user's menstrual cycle.
 *         example: 28
 *         minimum: 1
 *       regularity:
 *         type: boolean
 *         description: Whether the user's menstrual cycle is regular.
 *         example: true
 *         default: true
 *       mostCommonSymptom:
 *         type: string
 *         description: The most common symptom experienced by the user during their periods.
 *         example: cramps
 *   PeriodCycle:
 *     type: object
 *     required:
 *       - userId
 *       - from
 *       - predictedTo
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique identifier for the period cycle. (Auto-generated)
 *         readOnly: true
 *         example: 1
 *       userId:
 *         type: integer
 *         description: ID of the user who owns this period cycle.
 *         example: 1
 *       from:
 *         type: string
 *         format: date-time
 *         description: The date when the period started.
 *         example: 2021-01-01T00:00:00Z
 *       predictedTo:
 *         type: string
 *         format: date-time
 *         description: The predicted end date of the period.
 *         example: 2021-01-05T00:00:00Z
 *       to:
 *         type: string
 *         format: date-time
 *         description: The actual end date of the period.
 *         example: 2021-01-07T00:00:00Z
 */

periodRouter.get(
  '/typical',
  header('Authorization').isString().withMessage('Authorization header is required'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);
    getTypicalPeriod(token)
      .then((typicalPeriod) => res.json(typicalPeriod))
      .catch((err) => res.status(403).send(err));
  },
);

periodRouter.put(
  '/typical',
  header('Authorization').isString().withMessage('Authorization header is required'),
  body('cycleLength').optional().isInt({ min: 1 }),
  body('regularity').optional().isBoolean(),
  body('mostCommonSymptom').optional().isString(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);

    updateTypicalPeriod(
      token,
      req.body.cycleLength,
      req.body.regularity,
      req.body.mostCommonSymptom,
    )
      .then((r) => res.sendStatus(200))
      .catch((err) => res.status(403).send(err));
  },
);

periodRouter.get(
  '/current',
  header('Authorization').isString().withMessage('Authorization header is required'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);

    getCurrentPeriodCycle(token)
      .then((periodCycle) => res.json(periodCycle))
      .catch((err) => res.status(403).send(err));
  },
);

periodRouter.get(
  '/previous/:cycleCount',
  header('Authorization').isString().withMessage('Authorization header is required'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);
    const cycleCount = parseInt(req.params.cycleCount, 10);

    getPreviousPeriodCycles(token, cycleCount)
      .then((periodCycles) => res.json(periodCycles))
      .catch((err) => res.status(403).send(err));
  },
);

periodRouter.put(
  '/previous/:cycleId/mood/:dateTime',
  header('Authorization').isString().withMessage('Authorization header is required'),
  body('mood').isIn(moodOptions).withMessage('Invalid mood option'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);
    const cycleId = parseInt(req.params.cycleId, 10);

    recordMood(token, req.body.mood, req.params.dateTime, cycleId)
      .then((r) => res.sendStatus(200))
      .catch((err) => res.status(403).send(err));
  },
);

periodRouter.post(
  '/new-cycle',
  header('Authorization').isString().withMessage('Authorization header is required'),
  body('from').isString().isISO8601().withMessage('from date is required'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);

    initNewPeriodCycle(token, req.body.from)
      .then((r) => res.sendStatus(200))
      .catch((err) => res.status(403).send(err));
  },
);

periodRouter.post(
  '/mood',
  header('Authorization').isString().withMessage('Authorization header is required'),
  body('mood').isIn(moodOptions).withMessage('Invalid mood option'),
  body('dateTime').isString().isISO8601().withMessage('Date and time of mood entry is required'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);
    console.error('mood', req.body.mood);
    recordMood(token, req.body.mood, req.body.dateTime)
      .then((r) => res.sendStatus(200))
      .catch((err) => res.status(403).send(err));
  },
);

periodRouter.get('/mood', (req: Request, res: Response) => {
  res.json({
    moodList: moodOptions,
  });
});

periodRouter.post(
  '/symptom',
  header('Authorization').isString().withMessage('Authorization header is required'),
  body('symptom').isString(),
  body('dateTime').isString().isISO8601().withMessage('Date and time of mood entry is required'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.get('Authorization')!.substring(7);

    recordSymptom(token, req.body.symptom, req.body.dateTime)
      .then((r) => res.sendStatus(200))
      .catch((err) => res.status(403).send(err));
  },
);

export default periodRouter;
