
export interface PipelineInfoDTO {
    id: number,
    nome: string,
    descricao: string,
    clienteId: number,
    jobs: string[],
    checked: boolean,
}