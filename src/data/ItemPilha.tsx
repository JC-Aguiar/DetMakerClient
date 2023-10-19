import { ComandoSQL } from "./ComandoSQL";
import { JobDTO } from "./JobDTO";

export interface JobExecute {
    ordem: number;
    job: JobDTO;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
}

export interface JobExecuteDTO {
    ordem: number;
    id: number;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
}

export function converterEmDto(itemPilha: JobExecute): JobExecuteDTO {
    const dto: JobExecuteDTO = {
        ordem: itemPilha.ordem,
        id: itemPilha.job.id,
        argumentos: itemPilha.argumentos,
        queries: itemPilha.queries,
        cargas: itemPilha.cargas,
    };
    return dto;
}