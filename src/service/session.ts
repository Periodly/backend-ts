import { hashPassword } from '../tools/password';
import jwt from 'jsonwebtoken';
import { JwtTokenPayload, secret_token } from '../config';
import User from '../model/user.model';

export const login = async (username: string, password: string): Promise<string> => {
  const hashedPassword = hashPassword(password);
  const user = await User.findOne({
    where: {
      username,
      password: hashedPassword,
    },
  });

  if (user) {
    return generateToken(user.id, user.isAdmin, username);
  }
  throw "Can't authenticate user";
};

const generateToken = (id: number, admin: boolean, username: string): string => {
  return jwt.sign(
    <JwtTokenPayload>{
      id,
      admin,
      username,
    },
    secret_token,
  );
};
