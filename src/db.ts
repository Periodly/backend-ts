import { dbConfig } from './config';
import mariadb from 'mariadb';
import { Sequelize } from 'sequelize';
import userModel, { initUserModel } from './model/user.model';
import { initSessionModel } from './model/session.model';
import { hashPassword } from './tools/password';

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
    const admin = await userModel.findOne({ where: { username: 'admin' } });
    if (!admin) {
      await userModel.create({
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
