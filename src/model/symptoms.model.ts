import { DataTypes, Model, Sequelize } from 'sequelize';

class SymptomModel extends Model {
  declare id: number;
  declare date: Date;
  declare cycleId: number;
  declare symptom: string;
  declare flowType: number; // 0: none, 1: light, 2: medium, 3: heavy
}

export const initSymptomModel = (sequelize: Sequelize) => {
  SymptomModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cycleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'periodCycles',
          key: 'id',
        },
      },
      symptom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      flowType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'symptoms',
    },
  );
};

export default SymptomModel;
