import { DataTypes, Model, Sequelize } from 'sequelize';

class SessionModel extends Model {
  declare id: number;
  declare token: string;
  declare username: string;
  declare expiration: string;
}

export const initSessionModel = (sequelize: Sequelize) => {
  SessionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiration: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'sessions',
    },
  );
};

export default SessionModel;
