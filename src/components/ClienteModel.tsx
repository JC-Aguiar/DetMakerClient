export interface ClienteInterface {
    readonly cpf: string;
    readonly nome: string;
    readonly phone: string;
    readonly sobrenome: string;
}

export class ClienteModel implements ClienteInterface {
    public readonly cpf!: string;
    public readonly nome!: string;
    public readonly phone!: string;
    public readonly sobrenome!: string;

    constructor(cliente: ClienteInterface) {
        this.cpf = cliente.cpf;
        this.nome = cliente.nome;
        this.phone = cliente.phone;
        this.sobrenome = cliente.sobrenome;
    }
}
