import { AnexoInfoDTO } from "./AnexoInfoDTO";

export interface EvidenciaInfoDTO {
    id: number,
    job: string,
    jobDescricao: string,
    dataInicio: number,  
    dataFim: number, 
    duracao: number, 
    sucesso: boolean,
    ordem: number, 
    argumentos: string, 
    queries: string[],
    tabelasNome: string[],
    tabelasPreJob: string[],
    tabelasPosJob: string[],
    logs: AnexoInfoDTO[],
    cargas: AnexoInfoDTO[],
    saidas: AnexoInfoDTO[],
    analise: string,
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