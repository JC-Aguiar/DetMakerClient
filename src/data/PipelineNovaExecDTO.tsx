import { JobExecuteDTO } from "./JobExecute";
import { PipelineInfoDTO } from "./PIpelineInfoDTO";
import { RelatorioInfoDTO } from "./RelatorioInfoDTO";

export interface PipelineNovaExecDTO {
    pipeline: PipelineInfoDTO,
    relatorio: RelatorioInfoDTO,
    jobs: JobExecuteDTO[],
}