import { QueryInfoDTO } from "./QueryInfoDTO";

export interface JobInfoDTO {
    //Atributos de uso frontend/backend
    id: number;
    nome: string;
    executarAposJob: string[];
    grupoConcorrencia: string;
    fase: string;
    descricao: string;
    grupoUda: string;
    programa: string[];
    tabelas: string[];
    servidor: string;
    caminhoExec: string;
    parametros: string[];
    descricaoParametros: string[];
    diretorioEntrada: string;
    mascaraEntrada: string[];
    diretorioSaida: string;
    mascaraSaida: string[];
    diretorioLog: string;
    mascaraLog: string[];
    tratamento: string;
    escalation: string;
    dataAtualizacao: string;
    atualizadoPor: string;
    queries: QueryInfoDTO[];

    //Atributos de uso do front:
    //checked: boolean;
}

/**
 * Indentifica o parametro relacionado à Data do Ciclo (Ifxdate)
 * @param jobInfo {@link JobInfoDTO} 
 * @returns número do índice do parametro relacionado com à Data do Ciclo (Ifxdate) ou -1 caso não possua
 */  
export const getIndexParametroComIfxdate = (jobInfo: JobInfoDTO): number => {
    const paramIndex = jobInfo.parametros.findIndex(
        param => param.toUpperCase().includes("AAAAMMDD")
    );
    const paramDescIndex = jobInfo.descricaoParametros.findIndex(
        param => param.toLowerCase().includes("data") 
            && param.toLowerCase().includes("ciclo")
    );
    if (paramIndex === paramDescIndex && paramIndex !== -1) return paramIndex;
    return -1;
}