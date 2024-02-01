import { ComandoSQL } from "./ComandoSQL";

export interface ConfigQueryInfoDTO {
    id: number,
    jobId: number,
    comandosSql: ComandoSQL,
}