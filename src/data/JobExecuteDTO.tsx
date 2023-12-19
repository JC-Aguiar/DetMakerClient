import { ComandoSQL } from "./ComandoSQL";
import { JobConfig } from "./JobConfigDTO";

export interface JobExecuteDTO {
    id: number
    ordem: number;
    argumentos: string;
    queries: ComandoSQL[];
    cargas: string[];
}

export function parseJobConfigParaJobExecute(configDto: JobConfig): JobExecuteDTO {
    return {
        id: configDto.id,
        ordem: configDto.ordem,
        argumentos: configDto.argumentos.join(" "),
        queries: configDto.queries,
        cargas: configDto.cargas,
    } as JobExecuteDTO;
}