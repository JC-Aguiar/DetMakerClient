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
    revisor: string, 
    dataRevisao: Date,
    requisitos: string, 
    comentario: string, 
    resultado: string, 

    //propriedade usada somente no front
    lock: boolean,
}