export interface FilaResumoDTO {
    ticket: string,
    nomePipeline: string,
    autor: string,
    status: QueueStatus,
    data: number
}

export type QueueStatus = "AGUARDANDO" | "EXECUTANDO" | "FINALIZADO";