import { authorizeUser } from './user';
import { sequelize } from '../db';

export const getMoods = async (token: string) => {
  const username = (await authorizeUser(token)).username;
  return await sequelize.query(`SELECT * FROM moods WHERE username = '${username}'`);
};
