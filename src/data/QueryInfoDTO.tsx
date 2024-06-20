export interface QueryInfoDTO {
    id: number,
    nome: string,
    descricao: string,
    sql: string,
}

export namespace QueryInfoDTO {
    export function empty(): QueryInfoDTO {
        return {
            id: -1,
            nome: "",
            descricao: "",
            sql: "",
        };
    }
}