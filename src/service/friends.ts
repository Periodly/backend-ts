import FriendsModel from '../model/friends.model';
import { authorizeUser } from './user';
import UserModel from '../model/user.model';
import { Op } from 'sequelize';
import BestjaModel from '../model/bestje.model';
import MoodModel from '../model/mood.model';
import SymptomModel from '../model/symptoms.model';
import PeriodCycleModel from '../model/periodCycle.model';
import TypicalCycleModel from '../model/typicalCycle.model';

export const addFriend = async (token: string, friendName: string, asBeast: boolean = false) => {
  const userId = (await authorizeUser(token)).id;
  const friend = await UserModel.findOne({ where: { username: friendName } });

  if (!friend) {
    throw new Error('User not found');
  }

  if (asBeast) {
    const beast = await BestjaModel.findOne({
      where: { [Op.or]: [{ userId: userId }, { friendId: userId }] },
    });

    const beastFriendship = await BestjaModel.findOne({
      where: {
        [Op.or]: [
          { userId, friendId: friend.id },
          { userId: friend.id, friendId: userId },
        ],
      },
    });

    if (beast)
      throw new Error(
        'User already has a beast' + (beastFriendship ? ' and its the user you want to add' : ''),
      );

    return await BestjaModel.create({ userId, friendId: friend.id });
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

const getBeastInfo = async (userId: number) => {
  const beast = await BestjaModel.findOne({
    where: { [Op.or]: [{ userId }, { friendId: userId }] },
  });

  if (!beast) {
    throw new Error('No beast found');
  }

  const friend = await UserModel.findOne({
    where: { id: beast.userId === userId ? beast.friendId : beast.userId },
  });

  return friend ? friend : Promise.reject('No beast found');
};

export const getBeast = async (token: string) => {
  const userId = (await authorizeUser(token)).id;

  getBeastInfo(userId)
    .then((friend) => {
      return friend.username;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const getBeastStats = async (token: string) => {
  const friend = await getBeastInfo((await authorizeUser(token)).id);

  if (friend) {
    const friendCycle = await PeriodCycleModel.findOne({
      where: { userId: friend.id },
      order: [['createdAt', 'DESC']],
    });
    const friendStats = await MoodModel.findOne({
      where: { cycleId: friendCycle?.id },
      order: [['createdAt', 'DESC']],
    });
    const friendSymptom = await SymptomModel.findOne({
      where: { cycleId: friendCycle?.id },
      order: [['createdAt', 'DESC']],
    });
    const typicalCycle = await TypicalCycleModel.findOne({
      where: { userId: friend.id },
    });

    return {
      beast: friend.username,
      mood: friendStats?.mood,
      symptom: friendSymptom?.symptom,
      cycleLength: typicalCycle?.cycleLength,
      cycleDay: friendCycle
        ? Math.floor((new Date().getTime() - friendCycle.from.getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    };
  }
};
