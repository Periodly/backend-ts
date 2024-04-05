import { DataTypes, Model, Sequelize } from 'sequelize';

class TypicalCycleModel extends Model {
  declare id: number;
  declare userId: number;
  declare cycleLength: number;
  declare regularity: boolean;
  declare mostCommonSymptom: string;
}

export const initTypicalCycleModel = (sequelize: Sequelize) => {
  TypicalCycleModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      cycleLength: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      regularity: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      mostCommonSymptom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'typicalCycles',
    },
  );
};

export default TypicalCycleModel;
