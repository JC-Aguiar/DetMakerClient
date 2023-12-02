export interface RelatorioResumoDTO {
    id: number,
    idPipeline: number,
    nomePipeline: string,
    idProjeto: string,
    nomeProjeto: string,
    nomeAtividade: string,
    data: Date,
    sucesso: boolean,
    evidencias: number,
    revisados: number
}