import { AnexoInfoDTO } from "./AnexoInfoDTO";

export interface EvidenciaInfoDTO {
    id: number,
    ordem: number, 
    job: string,
    jobDescricao: string,
    argumentos: string, 
    queries: string[],
    queriesNome: string[],
    tabelasPreJob: string[],
    tabelasPosJob: string[],
    queriesInconformidade: string[],
    cargas: AnexoInfoDTO[],
    logs: AnexoInfoDTO[],
    saidas: AnexoInfoDTO[],
    exitCode: number;
    sha256: string;
    erroFatal: string;
    dataInicio: number,  
    dataFim: number, 
    duracao: number, 
    revisor: string, 
    dataRevisao: Date,
    requisitos: string, 
    comentario: string, 
    resultado: string, 
}

export function checkEvidenciaPronta(evidencia: EvidenciaInfoDTO): boolean {
    return evidencia.resultado !== null
        && evidencia.revisor !== null
        && evidencia.resultado.trim().length > 0
        && evidencia.revisor.trim().length > 0
        && evidencia.resultado !== 'null'
        && evidencia.revisor !== 'null';
}