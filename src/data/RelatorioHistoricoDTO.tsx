import { EvidenciaInfoDTO } from "./EvidenciaInfoDTO";

export interface RelatorioHistoricoDTO {
    pipeline: string,
    idProjeto: string,
    nomeProjeto: string,
    nomeAtividade: string,
    configuracao: string,
    parametros: string,
    dados: string,
    testeTipo: string,
    sistema: string,
    ambiente: string,
    evidencias: EvidenciaInfoDTO[],
    dataInicio: string,
    dataFim: string,
    sucesso: string,
}