export const port = 8080;
export const minPasswordLength = 4;

export const secret_token: string = process.env.SALT!;
export const sessionTTL = 60 * 60 * 24 * 2;


interface JwtTokenPayload {
    id: string,
    admin: boolean
}

enum ErrorMsg {
    authorizationErrorMsg = 'Authorization failed',
    authenticationErrorMsg = 'Authentication failed',
    alreadyExistsErrorMsg = 'Object interferes with other',
    accessDeniedErrorMsg = 'Access denied',
    notFound = 'Target not found',
    unprocessableEntity = 'Unprocessable Entity'
}

export {
    ErrorMsg,
    JwtTokenPayload
}