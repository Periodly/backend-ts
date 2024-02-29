import { DataTypes, Model, Sequelize } from 'sequelize';

class UserModel extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
  declare isAdmin: boolean;
}
export const initUserModel = (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
    },
  );
};

export default UserModel;
