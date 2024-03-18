import FriendsModel from '../model/friends.model';
import { authorizeUser } from './user';
import UserModel from '../model/user.model';
import { Op } from 'sequelize';

export const addFriend = async (token: string, friendName: string) => {
  const userId = (await authorizeUser(token)).id;
  const friend = await UserModel.findOne({ where: { username: friendName } });

  if (!friend) {
    throw new Error('User not found');
  }

  const friendship = await FriendsModel.findOne({
    where: {
      [Op.or]: [
        { userId, friendId: friend.id },
        { userId: friend.id, friendId: userId },
      ],
    },
  });
  if (friendship) {
    throw new Error('Friendship already exists');
  }

  console.log(userId, friend.id);
  return await FriendsModel.create({ userId, friendId: friend.id });
};

export const getFriends = async (token: string, id?: string) => {
  const adminAccess = (await authorizeUser(token)).admin;
  if (id && !adminAccess) return Promise.reject('Access denied');
  const user = id ? { id: parseInt(id) } : await authorizeUser(token);

  const friends = await FriendsModel.findAll({
    where: { [Op.or]: [{ userId: user.id }, { friendId: user.id }] },
    include: [
      {
        model: UserModel,
        as: 'users',
        attributes: ['username'],
      },
      {
        model: UserModel,
        as: 'friends',
        attributes: ['username'],
      },
    ],
  });
  const friendList: string[] = [];
  friends.forEach((friend) => {
    const friendName = friend.userId === user.id ? friend.friends.username : friend.users.username;
    friendList.push(friendName);
  });
  return friendList;
};
