import { JobExecuteDTO } from "./JobExecuteDTO";
import { PipelineInfoDTO } from "./PIpelineInfoDTO";
import { RelatorioInfoDTO } from "./RelatorioInfoDTO";
import { UserInfoDTO } from "./UserInfoDTO";

export interface PipelineExecDTO {
    ambienteId: number,
    pipeline: PipelineInfoDTO,
    relatorio: RelatorioInfoDTO,
    userInfo: UserInfoDTO,
    jobs: JobExecuteDTO[],
}