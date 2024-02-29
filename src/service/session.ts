import {hashPassword} from "../tools/password";
import {pool} from "../db";
import jwt from "jsonwebtoken";
import {JwtTokenPayload, secret_token, sessionTTL} from "../config";

export const login = async (username: string, password: string): Promise<string> => {
    const hashedPassword = hashPassword(password);
    const user = await pool.query(`SELECT id, isAdmin FROM users WHERE username = ? AND password = ?`, [username, hashedPassword])

    if (user) {
        return generateToken(user.id, user.admin);
    }
    throw "Can't authenticate user"
}

const generateToken = (id: string, admin: boolean): string => {
    return jwt.sign(<JwtTokenPayload>{
        id, admin
    }, secret_token, {
        expiresIn: sessionTTL
    });
}