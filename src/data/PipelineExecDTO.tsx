import { PipelineJobInputDTO } from "./PipelineJobInputDTO";

export interface PipelineExecDTO {
    clienteId: number,
    ambienteId: number,
    pipelineId: number,
    //atividade: AtividadeInfoDTO,
    user: string, //UserInfoDTO,
    massas?: string[],
    jobs: PipelineJobInputDTO[],
    configuracoes: { [key: string]: string },
}