export const minPasswordLength = 4;
export const secret_token: string = "saoidi2e90ds";
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