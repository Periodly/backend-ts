import express from 'express';

const periodRouter = express.Router();

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

export default periodRouter;
