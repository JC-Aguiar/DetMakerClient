import { EvidenciaInfoDTO } from "./EvidenciaInfoDTO";

export interface RelatorioHistoricoDTO {
    id: number,
    ticket: string,
    pipeline: string,
    descricao: string,
    idProjeto: string | null,
    nomeProjeto: string | null,
    nomeAtividade: string | null,
    consideracoes: string | null,
    inconformidades: string,
    parametros: string,
    testeTipo: string,
    cliente: string,
    ambiente: string,
    sucesso: boolean,
    erroFatal: string,
    usuario: string,
    evidencias: EvidenciaInfoDTO[],
    data: string,
}