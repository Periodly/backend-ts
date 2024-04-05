import { DataTypes, Model, Sequelize } from 'sequelize';

class SymptomModel extends Model {
  declare id: number;
  declare date: Date;
  declare cycleId: number;
  declare symptom: string;
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
          model: 'period',
          key: 'id',
        },
      },
      symptom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'symptoms',
    },
  );
};

export default SymptomModel;
