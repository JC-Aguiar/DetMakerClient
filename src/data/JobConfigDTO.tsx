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

export interface JobConfig {
    ordem: number;
    id: number;
    nome: string;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
}