export interface FiltroSQL {
    id?: number;
    tabela: string;
    coluna: string;
    tipo?: string;
    index: number;
    array: boolean;
    variavel: string;
    //valor?: string;
}

export namespace FiltroSQL {
    export function isEquals(filtro1: FiltroSQL, filtro2: FiltroSQL) {
        return filtro1.coluna === filtro2.coluna
        && filtro1.variavel === filtro2.variavel
        && filtro1.index === filtro2.index;
    }
}