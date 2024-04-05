import { DataTypes, Model, Sequelize } from 'sequelize';

class PeriodCycleModel extends Model {
  declare id: number;
  declare userId: number;
  declare from: Date;
  declare predictedTo: Date;
  declare to: Date;
}

export const initPeriodCycleModel = (sequelize: Sequelize) => {
  PeriodCycleModel.init(
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
      from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      predictedTo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      to: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'periodCycles',
    },
  );
};

export default PeriodCycleModel;
