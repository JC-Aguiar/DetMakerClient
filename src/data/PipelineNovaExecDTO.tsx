import { JobExecuteDTO } from "./JobExecute";
import { PipelineInfoDTO } from "./PIpelineInfoDTO";
import { RelatorioInfoDTO } from "./RelatorioInfoDTO";
import { UserInfoDTO } from "./UserInfoDTO";

export interface PipelineNovaExecDTO {
    //Atributos usados no backend
    userInfo: UserInfoDTO,
    jobs: JobExecuteDTO[],

    //Atributos usados no frontend
    pipeline: PipelineInfoDTO,
    relatorio: RelatorioInfoDTO,
}