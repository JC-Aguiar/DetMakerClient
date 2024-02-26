import { ComandoSQL } from "./ComandoSQL";

export interface QueryInfoDTO {
    id: number,
    nome: string,
    descricao: string,
    sql: string,
}