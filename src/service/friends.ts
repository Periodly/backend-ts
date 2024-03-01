import FriendsModel from '../model/friends.model';
import { authorizeUser } from './user';

export const addFriend = async (token: string, friendId: number) => {
  const userId = (await authorizeUser(token)).id;
  // check if the friendship already exists
  const friendship = await FriendsModel.findOne({
    where: { userId, friendId },
  });
  if (friendship) {
    throw new Error('Friendship already exists');
  }
  return await FriendsModel.create({ userId, friendId });
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
