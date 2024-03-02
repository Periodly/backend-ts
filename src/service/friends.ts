import FriendsModel from '../model/friends.model';
import { authorizeUser } from './user';
import UserModel from '../model/user.model';

export const addFriend = async (token: string, friendName: string) => {
  const userId = (await authorizeUser(token)).id;
  const friend = await UserModel.findOne({ where: { username: friendName } });

  if (!friend) {
    throw new Error('User not found');
  }

  const friendship = await FriendsModel.findOne({
    where: { userId, friendId: friend.id },
  });
  if (friendship) {
    throw new Error('Friendship already exists');
  }
  return await FriendsModel.create({ userId, friendId: friend.id });
};

export const getFriends = async (token: string) => {
  const userId = (await authorizeUser(token)).id;
  return await FriendsModel.findAll({
    where: { userId },
    include: [
      {
        association: 'friend',
        attributes: ['id', 'username'],
      },
    ],
  });
};
