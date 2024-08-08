import { ComandoSQL } from "./ComandoSQL";

export interface QueryInfoDTO extends ComandoSQL {
    id?: number,
    jobId: number
}

export namespace QueryInfoDTO {
    export function empty(jobId: number): QueryInfoDTO {
        return {
            jobId: jobId,
            ...ComandoSQL.empty()
        };
    }
}