import { JobExecuteDTO } from "./JobExecuteDTO";
import { PipelineInfoDTO } from "./PIpelineInfoDTO";
import { RelatorioInfoDTO } from "./RelatorioInfoDTO";
import { UserInfoDTO } from "./UserInfoDTO";

export interface PipelineNovaExecDTO {
    pipeline: PipelineInfoDTO,
    relatorio: RelatorioInfoDTO,
    userInfo: UserInfoDTO,
    jobs: JobExecuteDTO[],
}