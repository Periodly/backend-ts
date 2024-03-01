import { DataTypes, Model, Sequelize } from 'sequelize';

class FriendsModel extends Model {
  declare id: number;
  declare userId: number;
  declare friendId: number;
}

export const initFriendsModel = (sequelize: Sequelize) => {
  FriendsModel.init(
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
      tableName: 'friends',
    },
  );
};

export default FriendsModel;
