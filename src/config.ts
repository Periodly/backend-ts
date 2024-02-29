export const minPasswordLength = 4;
export const secret_token: string = "saoidi2e90ds";
export const sessionTTL = 60 * 60 * 24 * 2;

interface JwtTokenPayload {
    id: string,
    admin: boolean
}
export { JwtTokenPayload }