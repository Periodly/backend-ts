import { JwtTokenPayload, secret_token } from '../config';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../tools/password';
import User from '../model/user.model';

export async function createUser(
  username: string,
  password: string,
  isAdmin: boolean,
  token: string,
): Promise<void> {
  try {
    const hashedPassword = hashPassword(password);
    await User.create({
      username,
      password: hashedPassword,
      isAdmin,
    });
  } catch (err: any) {
    throw 'User already exists';
  }
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
