export interface FiltroSQL {
    id?: number,
    tabela: string,
    coluna: string,
    tipo: TipoColuna,
    index: number,
    array: boolean,
    variavel: string,
    metaDados?: {
        length?: number, 
        precision?: number, 
        scale?: number
    }
    //valor?: string,
}

export type TipoColuna = 'UNSET' | 'INT' | 'LOB' | 'CHAR' | 'LONG' | 'DATE' | 'REAL' | 'FLOAT' | 'DOUBLE' | 'NUMBER' | 'DECIMAL' | 'NUMERIC' | 'TIMESTAMP';

export namespace FiltroSQL {
    export function isEquals(filtro1: FiltroSQL, filtro2: FiltroSQL) {
        return filtro1.coluna === filtro2.coluna
        && filtro1.variavel === filtro2.variavel
        && filtro1.index === filtro2.index;
    }
}