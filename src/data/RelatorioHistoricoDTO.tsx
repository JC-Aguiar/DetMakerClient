import { EvidenciaInfoDTO } from "./EvidenciaInfoDTO";

export interface RelatorioHistoricoDTO {
    id: number,
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
    data: string,
    sucesso: string,
}