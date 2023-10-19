import { ComandoSQL } from "./ComandoSQL";

export interface EvidenciaTabela {
    resultado: Array<Map<string, any>>;
}

export interface EvidenciaDTO {
    ordem: number;
    id: number;
    job: string;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
    tabelasPreJob: { [key: string]: EvidenciaTabela };
    tabelasPosJob: { [key: string]: EvidenciaTabela };
    logs: File[];
    entradas: File[];
    saidas: File[];
    sucesso: boolean;
}