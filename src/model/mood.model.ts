import { DataTypes, Model, Sequelize } from 'sequelize';

class MoodModel extends Model {
  declare id: number;
  declare cycleId: number;
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
      cycleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'periodCycles',
          key: 'id',
        },
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
