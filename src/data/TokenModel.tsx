import { UsuarioInterface } from "./UsuarioModel";

export interface TokenInterface {
    readonly jwt: JwtModel;
    readonly usuario: UsuarioInterface;
}

export class JwtModel {
    private _tipo: string;
    private _codigo: string;

    constructor(tipo: string, codigo: string) {
        this._tipo = tipo;
        this._codigo = codigo;
    }
}

export class TokenModel implements TokenInterface {
    public readonly jwt: JwtModel;
    public readonly usuario: UsuarioInterface;

    constructor(token: TokenInterface) {
        this.jwt = token.jwt;
        this.usuario = token.usuario;
    }
}

