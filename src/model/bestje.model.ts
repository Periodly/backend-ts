import { DataTypes, Model, Sequelize } from 'sequelize';

class BestjaModel extends Model {
  declare id: number;
  declare userId: number;
  declare friendId: number;
}

export const initBestjaModel = (sequelize: Sequelize) => {
  BestjaModel.init(
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
      friendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'bestje',
    },
  );
};

export default BestjaModel;
