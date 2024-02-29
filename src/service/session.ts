import {hashPassword} from "../tools/password";
import {pool} from "../db";
import jwt from "jsonwebtoken";
import {ErrorMsg, JwtTokenPayload, secret_token, sessionTTL} from "../config";

export async function login(username: string, password: string): Promise<string> {
    const hashedPassword = hashPassword(password);
    const user = await pool.query(`SELECT id, isAdmin FROM users WHERE username = ? AND password = ?`, [username, hashedPassword])

    if (user) {
        return generateToken(user.id, user.admin);
    }
    throw ErrorMsg.authenticationErrorMsg;
}

function generateToken(id: string, admin: boolean): string {
    return jwt.sign(<JwtTokenPayload>{
        id, admin
    }, secret_token, {
        expiresIn: sessionTTL
    });
}