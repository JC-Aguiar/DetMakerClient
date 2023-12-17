export interface JwtDTO {
    access_token: string,
    expires_in: number,
    scope: string,
    token_type: string,
    id_token: string
}

export function validarJwt(jwt: JwtDTO | null): boolean {
    if (jwt == null) return false;
    return jwt.access_token !== null 
        && jwt.expires_in !== null 
        && jwt.scope !== null 
        && jwt.token_type !== null 
        && jwt.id_token !== null
        && jwt.access_token.length > 0;
}