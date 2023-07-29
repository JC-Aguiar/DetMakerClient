export interface ErroInterface {
    readonly timestamp: number;
    readonly status: number;
    readonly error: string;
    readonly mensagem: string | string[];
    readonly path: string;
}

export class ErroModel implements ErroInterface {
    public readonly timestamp: number;
    public readonly status: number;
    public readonly error: string;
    public readonly mensagem: string | string[];
    public readonly path: string;

    constructor(response: ErroModel) {
        this.timestamp = response.timestamp;
        this.status = response.status;
        this.error = response.error;
        this.mensagem = response.mensagem;
        this.path = response.path;
    }

    toString() {
        return `[ResponseModel]:
                \t timestamp: ${this.timestamp}
                \t status: ${this.status}
                \t error: ${this.error}
                \t mensagem: ${this.mensagem}
                \t path: ${this.path}`;
    }
}
