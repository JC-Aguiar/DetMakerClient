import { JobExecuteDTO } from "./JobExecuteDTO";
import { AtividadeInfoDTO } from "./AtividadeInfoDTO";
import { UserInfoDTO } from "./UserInfoDTO";

export interface PipelineExecDTO {
    clienteId: number,
    ambienteId: number,
    pipelineId: number,
    atividade: AtividadeInfoDTO,
    user: UserInfoDTO,
    massas?: string[],
    jobs: JobExecuteDTO[],
    configuracoes: { [key: string]: string },
}