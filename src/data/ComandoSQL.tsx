import { FiltroSQL } from "./FiltroSQL";

export interface ComandoSQL {
    campos: string[];
    tabela: string;
    filtros: FiltroSQL[];
    ordem: string;
    descricao: string;
    dinamico: boolean;
}