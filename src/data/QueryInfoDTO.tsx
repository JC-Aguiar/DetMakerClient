import { ComandoSQL } from "./ComandoSQL";

export interface QueryInfoDTO {
    id?: number,
    jobId: number,
    nome: string,
    descricao: string,
    sql: string,
}

export interface QueryInfo extends QueryInfoDTO {
    filtros: Map<string, string>,
}

export namespace QueryInfoDTO {

    export function empty(jobId: number): QueryInfoDTO {
        return {
            jobId: jobId,
            nome: '',
            descricao: '',
            sql: '',
        };
    }
}


export namespace QueryInfo {

    export function empty(jobId: number): QueryInfo {
        return {
            ...QueryInfoDTO.empty(jobId),
            filtros: new Map(),
        };
    }

    export function parseDTO(dto: QueryInfoDTO): QueryInfo {
        return {
            ...dto,
            filtros: ComandoSQL.getFiltrosFromQuery(dto.sql),
        };
    }
}