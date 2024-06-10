import { JobExecuteDTO } from "./JobExecuteDTO";
import { AtividadeInfoDTO } from "./AtividadeInfoDTO";
import { UserInfoDTO } from "./UserInfoDTO";

export interface PipelineExecDTO {
    clienteId: number,
    ambienteId: number,
    pipelineId: number,
    atividade: AtividadeInfoDTO,
    user: UserInfoDTO,
    jobs: JobExecuteDTO[],
}