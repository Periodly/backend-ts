import { dbConfig } from './config';
import mariadb from 'mariadb';
import { Sequelize } from 'sequelize';
import UserModel, { initUserModel } from './model/user.model';
import { initSessionModel } from './model/session.model';
import { hashPassword } from './tools/password';
import MoodModel, { initMoodModel } from './model/mood.model';
import FriendsModel, { initFriendsModel } from './model/friends.model';

export const sequelize = new Sequelize(dbConfig.database, dbConfig.user, '', {
  dialect: 'mariadb',
  host: dbConfig.host,
  port: dbConfig.port,
});

initializeDb();

async function initializeDb() {
  try {
    const pool = mariadb.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      connectionLimit: 5,
    });
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await sequelize.authenticate();
    await sequelize.sync();
    // if admin user does not exist, create it
    const admin = await UserModel.findOne({ where: { username: 'admin' } });
    if (!admin) {
      await UserModel.create({
        username: 'admin',
        password: hashPassword('admin'),
        isAdmin: true,
      });
    }
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initUserModel(sequelize);
initSessionModel(sequelize);
initMoodModel(sequelize);
initFriendsModel(sequelize);

MoodModel.hasMany(UserModel, { foreignKey: 'userId' });
UserModel.belongsTo(MoodModel);

FriendsModel.hasMany(UserModel, { foreignKey: 'userId', as: 'user' });
FriendsModel.hasMany(UserModel, { foreignKey: 'friendId', as: 'friend' });
UserModel.belongsTo(FriendsModel);
