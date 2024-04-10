import TypicalCycleModel from '../model/typicalCycle.model';
import { authorizeUser } from './user';
import PeriodCycleModel from '../model/periodCycle.model';
import MoodModel from '../model/mood.model';
import SymptomModel from '../model/symptoms.model';
import { moodOptions } from '../config';

export const getTypicalPeriod = async (token: string) => {
  const userId = (await authorizeUser(token)).id;
  return TypicalCycleModel.findOne({
    where: { userId },
  });
};

export const updateTypicalPeriod = async (
  token: string,
  cycleLength?: number,
  regularity?: boolean,
  mostCommonSymptom?: string,
) => {
  const userId = (await authorizeUser(token)).id;
  const typicalPeriod = await TypicalCycleModel.findOne({
    where: { userId },
  });
  if (!typicalPeriod) {
    return TypicalCycleModel.create({
      userId,
      cycleLength,
      regularity,
      mostCommonSymptom,
    });
  }
  return typicalPeriod.update({
    cycleLength,
    regularity,
    mostCommonSymptom,
  });
};

export const getPreviousPeriodCycles = async (token: string, cycleCount: number) => {
  const userId = (await authorizeUser(token)).id;
  const periods = await PeriodCycleModel.findAll({
    where: { userId },
    order: [['from', 'DESC']],
    attributes: ['id'],
  });

  if (cycleCount > periods.length) {
    throw new Error('No previous, matching, period cycle found');
  }

  return getPeriodCycle(periods[cycleCount - 1].id);
};

export const getCurrentPeriodCycle = async (token: string) => {
  const userId = (await authorizeUser(token)).id;
  const period = await PeriodCycleModel.findOne({
    where: { userId, to: null },
  });

  if (!period) {
    throw new Error('No active period cycle found');
  }

  return getPeriodCycle(period.id);
};

const getPeriodCycle = async (cycleId: number) => {
  const period = await PeriodCycleModel.findOne({
    where: { id: cycleId },
    attributes: ['id', 'from', 'predictedTo'],
  });

  if (!period) {
    throw new Error('No active period cycle found');
  }

  const cycleMoods = await MoodModel.findAll({
    where: { cycleId },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'date', 'mood'],
  });

  const cycleSymptoms = await SymptomModel.findAll({
    where: { cycleId },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'date', 'symptom'],
  });

  return {
    periodCycleInfo: period,
    moods: cycleMoods,
    symptoms: cycleSymptoms,
  };
};

export const initNewPeriodCycle = async (token: string, fromDate: string) => {
  const userId = (await authorizeUser(token)).id;
  const period = await PeriodCycleModel.findOne({
    where: { userId, to: null },
  });

  let cycleLength = 28;
  if (period) {
    cycleLength = await endPeriodCycle(userId, fromDate);
  }

  const predictedTo = new Date(fromDate);
  predictedTo.setDate(predictedTo.getDate() + cycleLength);

  return PeriodCycleModel.create({
    userId,
    from: new Date(fromDate),
    predictedTo,
  });
};

const endPeriodCycle = async (userId: number, toDate: string) => {
  const period = await PeriodCycleModel.findOne({
    where: { userId, to: null },
  });
  const typicalPeriod = await TypicalCycleModel.findOne({
    where: { userId },
  });

  if (!period || !typicalPeriod) {
    throw new Error('No active period cycle found');
  }

  await period.update({
    to: new Date(toDate),
  });

  const newCycleLength = Math.round(
    (typicalPeriod.cycleLength + period.to.getDate() - period.from.getDate()) / 2,
  );
  await typicalPeriod.update({
    cycleLength: newCycleLength,
  });

  return newCycleLength;
};

export const recordMood = async (token: string, mood: string, dateTime: string) => {
  const userId = (await authorizeUser(token)).id;
  const period = await PeriodCycleModel.findOne({
    where: { userId, to: null },
  });

  if (!period) {
    throw new Error('No active period cycle found');
  }

  if (!moodOptions.includes(mood)) {
    throw new Error('Invalid mood option');
  }

  return await MoodModel.create({
    userId,
    cycleId: period.id,
    mood,
    date: new Date(dateTime),
  });
};

export const recordSymptom = async (token: string, symptom: string, dateTime: string) => {
  const userId = (await authorizeUser(token)).id;
  const period = await PeriodCycleModel.findOne({
    where: { userId, to: null },
  });

  if (!period) {
    throw new Error('No active period cycle found');
  }

  return await SymptomModel.create({
    userId,
    cycleId: period.id,
    symptom,
    date: new Date(dateTime),
  });
};
