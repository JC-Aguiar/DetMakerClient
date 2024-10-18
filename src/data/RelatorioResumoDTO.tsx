export interface RelatorioResumoDTO {
    id: number,
    ticket: string,
    nomePipeline: string,
    idProjeto: string | null,
    nomeProjeto: string | null,
    nomeAtividade: string | null,
    autor: string,
    data: number,
    erro: boolean,
    evidencias: number,
    revisados: number
}
