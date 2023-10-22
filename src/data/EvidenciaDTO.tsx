import { ComandoSQL } from "./ComandoSQL";

export interface EvidenciaTabela {
    resultado: Array<Map<string, any>>;
}

export interface EvidenciaDTO {
    job: string;
    sucesso: boolean;
    ordem: number;
    argumentos: string;
    queries: string[];
    tabelasPreJob: string[];
    tabelasPosJob: string[];
    logs: string[];
    cargas: string[];
    saidas: string[];
}