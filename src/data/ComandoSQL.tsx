import { FiltroSQL } from "./FiltroSQL";

export interface ComandoSQL {
    campos: string[];
    tabela: string;
    filtros: FiltroSQL[];
    sql: string;
    descricao: string;
    dinamico: boolean;
}