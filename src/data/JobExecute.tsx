import { ComandoSQL } from "./ComandoSQL";
import { JobInfoDTO } from "./JobInfoDTO";

export interface JobConfigDTO {
    ordem: number;
    job: JobInfoDTO;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
}

export interface JobExecuteDTO {
    ordem: number;
    id: number;
    nome: string;
    argumentos: string;
    queries: ComandoSQL[];
    cargas: string[];
}

export function configToExecuteDto(itemPilha: JobConfigDTO): JobExecuteDTO {
    return {
        ordem: itemPilha.ordem,
        id: itemPilha.job.id,
        nome: itemPilha.job.nome,
        argumentos: itemPilha.argumentos.join(" "),
        queries: itemPilha.queries,
        cargas: itemPilha.cargas,
    } as JobExecuteDTO;
}