import { authorizeUser } from './user';
import { sequelize } from '../db';
import MoodModel from '../model/mood.model';

export const getMoods = async (token: string) => {
  const userId = (await authorizeUser(token)).id;
  return await MoodModel.findAll({ where: { userId } });
};

export const addMood = async (token: string, mood: string) => {
  const userId = (await authorizeUser(token)).id;
  return await MoodModel.create({ userId, mood, date: new Date() });
};
