import { DataTypes, Model, Sequelize } from 'sequelize';

class MoodModel extends Model {
  declare id: number;
  declare userId: number;
  declare mood: string;
  declare date: Date;
}

export const initMoodModel = (sequelize: Sequelize) => {
  MoodModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mood: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'moods',
    },
  );
};

export default MoodModel;
