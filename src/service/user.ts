import { JwtTokenPayload, secret_token } from '../config';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../tools/password';
import User from '../model/user.model';
import TypicalCycleModel from '../model/typicalCycle.model';

export async function createUser(
  username: string,
  password: string,
  cycleLength: number,
  regularity: boolean,
  mostCommonSymptom: string,
  isAdmin: boolean,
  token?: string,
): Promise<void> {
  try {
    const adminAccess = token ? (await authorizeAdmin(token)).admin : false;
    if (isAdmin && !adminAccess) return Promise.reject('Authorization needed');
    const hashedPassword = hashPassword(password);
    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: {
        username,
        password: hashedPassword,
        isAdmin,
      },
    });
    if (!created) return Promise.reject('User already exists');

    await TypicalCycleModel.create({
      userId: user.id,
      cycleLength,
      regularity,
      mostCommonSymptom,
    });

    return Promise.resolve();
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function getAllUsers(token: string): Promise<User[]> {
  const adminAccess = token ? (await authorizeAdmin(token)).admin : false;
  if (!adminAccess) throw 'Access denied';
  return User.findAll({
    attributes: ['id', 'username', 'isAdmin'],
  });
}

export async function deleteUser(token: string, id: string): Promise<void> {
  const adminAccess = token ? (await authorizeAdmin(token)).admin : false;
  if (!adminAccess) throw 'Access denied';
  await User.destroy({
    where: {
      id,
    },
  });
}

export async function authorizeUser(token: string): Promise<JwtTokenPayload> {
  try {
    const verified: JwtTokenPayload = jwt.verify(token, secret_token) as JwtTokenPayload;
    return {
      admin: verified.admin,
      id: verified.id,
      username: verified.username,
    };
  } catch (err: any) {
    throw "Can't authorize user";
  }
}

export async function authorizeAdmin(token: string): Promise<JwtTokenPayload> {
  const sessionData = await authorizeUser(token);
  if (!sessionData!.admin) throw 'Access denied';
  return sessionData;
}
