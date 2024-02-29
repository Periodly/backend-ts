export const minPasswordLength = 4;
export const secret_token: string = 'saoidi2e90ds';
export const sessionTTL = 60 * 60 * 24 * 2;

export const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'prdly',
};

interface JwtTokenPayload {
  id: number;
  admin: boolean;
  username: string;
}
export { JwtTokenPayload };
