import { ComandoSQL } from "./ComandoSQL";

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
    queries: ComandoSQL[];

    //Atributos de uso do front:
    //checked: boolean;
}
