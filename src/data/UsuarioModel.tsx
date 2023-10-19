import { ClienteInterface } from "./ClienteModel";

export interface UsuarioInterface {
    readonly email: string;
    readonly foto: string;
    readonly nome: string;
    readonly cliente?: ClienteInterface;
}

export default class UsuarioModel implements UsuarioInterface {
    public readonly email!: string;
    public readonly foto!: string;
    public readonly nome!: string;
    public readonly cliente?: ClienteInterface | undefined;

    constructor(usuario: UsuarioInterface) {
        this.email = usuario.email;
        this.foto = usuario.foto;
        if (this.cliente == null || this.cliente === undefined) {
            const emailNome = this.email.split("@")[0];
            this.nome = emailNome
                .replace("." || "-" || "," || "_", " ")
                .toLowerCase();
        } else {
            this.nome = `${this.cliente.nome} ${this.cliente.sobrenome}`;
        }
    }

    toString() {
        return `[UsuarioModel]:
                \temail: ${this.email}
                \tfoto: ${this.foto}
                \tnome: ${this.nome}
                \tcliente: ${this.cliente}`;
    }
}
