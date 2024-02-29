import { JwtTokenPayload, secret_token } from "../config";
import jwt from "jsonwebtoken";
import { hashPassword } from "../tools/password";
import { pool } from "../db";

export async function createUser(username: string, password: string, isAdmin: boolean, token: string): Promise<void> {
    await authorizeAdmin(token);
    try {
        await pool.query(
            `INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)`,
            [username, hashPassword(password), isAdmin]
        )
        await pool.query(
            `CREATE TABLE ${username} (id INT AUTO_INCREMENT, data DATE, mood TEXT, PRIMARY KEY (id))`
        )
    } catch (err: any) {
        throw "User already exists"
    }
}

export async function authorizeUser(token: string): Promise<JwtTokenPayload> {
    try {
        const verified: JwtTokenPayload = jwt.verify(token, secret_token) as JwtTokenPayload;
        return {
            admin: verified.admin,
            id: verified.id
        };
    } catch (err: any) {
        throw "Can't authorize user"
    }
}

export async function authorizeAdmin(token: string): Promise<JwtTokenPayload> {
    const sessionData = await authorizeUser(token);
    if (!sessionData!.admin) throw "Access denied"
    return sessionData;
}