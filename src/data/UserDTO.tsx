export interface UserDTO {
    sub: string,
    name: string,
    picture: string,
    email: string,
    locale: string,
    hd:  string,
}

export function validarUser(user: UserDTO | null): boolean {
    if (user == null) return false;
    return (user.email !== null && user.name !== null && user.email.length > 0 && user.name.length > 0);
}