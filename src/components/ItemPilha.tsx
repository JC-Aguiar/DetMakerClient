import { JobDTO } from "./JobDTO";
import { ComandoSQL } from "./ComandoSQL";

export interface ItemPilha {
    ordem: number;
    job: JobDTO;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
}

export interface ItemPilhaDTO {
    ordem: number;
    id: number;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
}

export function converterEmDto(itemPilha: ItemPilha): ItemPilhaDTO {
    const dto: ItemPilhaDTO = {
        ordem: itemPilha.ordem,
        id: itemPilha.job.id,
        argumentos: itemPilha.argumentos,
        queries: itemPilha.queries,
        cargas: itemPilha.cargas,
    };
    return dto;
}