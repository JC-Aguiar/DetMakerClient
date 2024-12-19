import { AnexoInfoDTO } from "./AnexoInfoDTO";
import { ExecQueryDTO } from "./ExecQueryDTO";

export interface EvidenciaInfoDTO {
    id: number,
    ordem: number, 
    job: string,
    jobDescricao: string,
    comandoExec: string,
    argumentos: string, 
    queries: ExecQueryDTO[],
    //queriesNome: string[],
    //tabelasPreJob: string[],
    //tabelasPosJob: string[],
    //queriesInconformidade: string[],
    cargas: AnexoInfoDTO[],
    logs: AnexoInfoDTO[],
    remessas: AnexoInfoDTO[],
    exitCode: number;
    sha256: string;
    erroFatal: string;
    dataInicio: number,  
    dataFim: number, 
    duracao: number, 
    revisor: string, 
    dataRevisao: number,
    requisitos: string, 
    comentario: string, 
    resultado: string, 
}

export namespace EvidenciaInfoDTO {
    export function isEvidenciaPronta(evidencia: EvidenciaInfoDTO): boolean {
        return evidencia.resultado !== null
            && evidencia.revisor !== null
            && evidencia.resultado.trim().length > 0
            && evidencia.revisor.trim().length > 0
            && evidencia.resultado !== 'null'
            && evidencia.revisor !== 'null';
    }
}