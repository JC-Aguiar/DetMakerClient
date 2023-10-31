export interface JobDTO {
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

    //Atributos de uso do front:
    checked: boolean;
}
